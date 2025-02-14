"use strict";

const http = require("http");
const url = require("url");
const DBConfig = require("./DBConfig");
const DAO = require("./DAO");
const msgs = require("../lang/en");

// Initialize DB on server start
DBConfig.initializeDatabase()
    .then(() => console.log("Database initialized"))
    .catch((err) => {
        console.error("Database initialization failed:", err);
        process.exit(1); // Exit if DB initialization fails
    });

class Server {
    port;
    endpoint;
    server;

    constructor(port, endpoint) {
        this.port = port;
        this.endpoint = endpoint;
        this.createServer();
    }

    createServer() {
        this.server = http.createServer((req, res) => {
            const q = url.parse(req.url, true);

            res.setHeader("Access-Control-Allow-Origin", "*"); // allows any domain to make requests to server
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // defines which HTTP methods allowed
            res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // allows the client to send custom headers
            res.setHeader("Content-Type", "text/html"); // response in HTML format

            // handle options
            if (req.method === "OPTIONS") {
                res.writeHead(204).end();  // no content
                return;
            }

            if (!q.pathname.startsWith(this.endpoint)) {
                res.end(`<p style="color: red;">${msgs.error404}</p>`); // page not found
                return;
            }

            if (req.method === "GET") {
                this.handleGet(req, res, q);
            } else if (req.method === "POST") {
                this.handlePost(req, res, q);
            } else {
                res.writeHead(405, { "Content-Type": "text/html" });
                res.end(`<p style="color: red;">${msgs.error405}</p>`); // method not supported
            }
        });
    }

    startServer() {
        this.server.listen(this.port, async () => {
            console.log(`Server running on port ${this.port}`);

            // Test: Insert a patient when the server starts
            try {
                const result = await DAO.insertPatient("John Doe", "1990-01-01"); // Test insert
                console.log("Test patient inserted successfully:", result);
            } catch (err) {
                console.error("Error inserting test patient:", err.message);
            }
        });
    }

    closeServer() {
        this.server.close();
    }

    async handleGet(req, res, q) {
        try {
            const patientId = q.query.id; // Get the patient ID from the query string
            if (patientId) {
                // Fetch a specific patient by ID
                const patient = await DAO.getPatientById(patientId);
                if (patient.length > 0) {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(`<p>Patient found: ${JSON.stringify(patient[0])}</p>`);
                } else {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(`<p style="color: red;">Patient not found</p>`);
                }
            } else {
                // Fetch all patients (if no ID is provided)
                const patients = await DAO.getAllPatients();
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`<p>All patients: ${JSON.stringify(patients)}</p>`);
            }
        } catch (err) {
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end(`<p style="color: red;">${err.message}</p>`);
        }
    }

    async handlePost(req, res, q) {
        try {
            const body = await this.parseBody(req);
            const data = JSON.parse(body); // Parse the body as JSON
            const result = await DAO.insertPatient(data.name, data.dateOfBirth);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<p>Patient inserted successfully: ${JSON.stringify(result)}</p>`);
        } catch (err) {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end(`<p style="color: red;">${err.message}</p>`);
        }
    }

    parseBody(req) {
        return new Promise((resolve) => {
            let body = ""; // empty string to store req data
            req.on("data", chunk => { // listen for data events
                body += chunk; // append chunk to body
            });
            req.on("end", () => { // end when all chunks received
                resolve(body); // resolve with raw body
            });
        });
    }
}

module.exports = Server;