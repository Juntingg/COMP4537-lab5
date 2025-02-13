"use strict"

const http = require("http");
const url = require("url");
const msgs = require("../lang/en");

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
            res.setHeader("Content-Type", "application/json"); // response in JSON format

            // handle options
            if (req.method === "OPTIONS") {
                res.writeHead(204).end();  // no content
                return;
            }

            if (!q.pathname.startsWith(this.endpoint)) {
                res.end(`<p style="color: red;">${msgs.error404}</p>`);// page not found
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
        this.server.listen(this.port)
    }

    closeServer() {
        this.server.close();
    }

    async handlePost(req, res, q) {
        try {
            const data = await parseBody(req);
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