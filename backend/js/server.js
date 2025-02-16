"use strict";

const http = require("http");
const url = require("url");
const DBConfig = require("./DBConfig");
const msgs = require("../lang/en")

class Server {
    #port;
    #endpoint;
    #server;

    constructor(port, endpoint) {
        this.#port = port;
        this.#endpoint = endpoint;
        this.#createServer();
    }

    #createServer() {
        try {
            this.DBConfig = new DBConfig.DBConfig();
        } catch (e) {
            console.error("Error establishing connection to DB, please restart server to try again");
            return;
        }
        this.#server = http.createServer((req, res) => {
            const q = url.parse(req.url, true);

            res.setHeader("Access-Control-Allow-Origin", "*"); // Allow any domain to make requests
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow GET, POST, OPTIONS
            res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow custom headers
            res.setHeader("Content-Type", "application/json"); // Response in HTML format

            // Handle OPTIONS (preflight requests)
            if (req.method === "OPTIONS") {
                res.writeHead(204).end(); // No content
                return;
            }

            if (!q.pathname.startsWith(this.#endpoint)) {
                res.end(JSON.stringify({ message: msgs.error404 })); // page not found
                return;
            }

            if (req.method === "GET") {
                this.#handleGet(req, res);
            } else if (req.method === "POST") {
                this.#handlePost(req, res);
            } else {
                res.writeHead(405, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: msgs.error405 })); // method not supported
            }
        });
    }

    startServer() {
        this.#server.listen(this.#port, () => {
            console.log(`Server running on port ${this.#port}`);
        });
    }

    closeServer() {
        this.#server.close();
    }

    async #handleGet(req, res) {

        const encodedUrl = req.url.split(this.#endpoint)[1];
        const query = decodeURIComponent(encodedUrl).replaceAll("\"", ""); // Remove quotes

        // Validate that the query is a SELECT query
        if (query.split(" ")[0].toUpperCase() !== "SELECT") {
            res.writeHead(400).end(JSON.stringify({ error: "GET request only supports SELECT queries" }));
            return;
        }

        let result;
        try {
            result = await this.DBConfig.queryDB(query); // Execute the query
        } catch (e) {
            res.writeHead(400).end(JSON.stringify({ error: e.sqlMessage || "Invalid query" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ result }));
    }

    async #handlePost(req, res) {
        const data = await this.#parseBody(req);

        if (!data || data.split(" ")[0].toUpperCase() !== "INSERT") {
            res.writeHead(400).end(JSON.stringify({ error: "POST request only supports INSERT queries" }));
            return;
        }

        try {
            data
            await this.DBConfig.queryDB(data); // Execute the query
        } catch (e) {
            res.writeHead(400).end(JSON.stringify({ error: e.sqlMessage || "Invalid query" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ result: "Database successfully updated" }));
    }

    #parseBody(req) {
        return new Promise((resolve) => {
            let body = ""; // Empty string to store request data
            req.on("data", (chunk) => { // Listen for data events
                body += chunk; // Append chunk to body
            });
            req.on("end", () => { // End when all chunks are received
                resolve(body); // Resolve with the raw body
            });
        });
    }
}

module.exports = Server;