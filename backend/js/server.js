// This code was assisted by ChatGPT, OpenAI.
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
            process.exit(1)
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
                res.end(JSON.stringify({ error: msgs.error404 })); // page not found
                return;
            }

            if (req.method === "GET") {
                this.#handleGet(req, res);
            } else if (req.method === "POST") {
                this.#handlePost(req, res);
            } else {
                res.writeHead(405, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: msgs.error405 })); // method not supported
            }
        });
    }

    startServer() {
        this.#server.listen(this.#port)
    }

    closeServer() {
        this.#server.close();
    }

    async #handleGet(req, res) {
        try {
            // extract the query from the URL path
            const encodedUrl = req.url.split(this.#endpoint)[1]; // endpoint is "/api/v1/sql/"
            if (!encodedUrl) {
                res.writeHead(400).end(JSON.stringify({ error: msgs.errorNoQuery }));
                return;
            }

            const query = decodeURIComponent(encodedUrl).replaceAll("\"", ""); // remove quotes and decode

            // validate that the query is a SELECT query
            if (!query || !query.trim().toUpperCase().startsWith("SELECT")) {
                res.writeHead(400).end(JSON.stringify({ error: msgs.errorGet }));
                return;
            }

            const result = await this.DBConfig.queryDB(query);  // execute query

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result }));
        } catch (e) {
            res.writeHead(400).end(JSON.stringify({ error: e.sqlMessage }));
        }
    }

    async #handlePost(req, res) {
        try {
            const data = await this.#parseBody(req); // parse the request body

            // validate that the query is an INSERT query
            if (!data || !data.trim().toUpperCase().startsWith("INSERT")) {
                res.writeHead(400).end(JSON.stringify({ error: msgs.errorPost }));
                return;
            }

            // execute the query
            await this.DBConfig.queryDB(data);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: msgs.success }));
        } catch (e) {
            res.writeHead(400).end(JSON.stringify({ error: e.sqlMessage }));
        }
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