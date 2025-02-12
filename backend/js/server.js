"use strict"

const http = require("http");
const url = require("url");
const msgs = require("../lang/en");

class Server {
    port;
    endPoint;
    server;

    constructor(port, endPoint) {
        this.port = port;
        this.endPoint = endPoint;
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
                res.end(JSON.stringify({ message: msgs.error404 })); // page not found
                return;
            }

            if (req.method === "GET") {
                this.handleGet(req, res, q);
            } else if (req.method === "POST") {
                this.handlePost(req, res, q);
            } else {
                res.writeHead(405, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: msgs.error405 })); // method not supported
            }
        });
    }

    startServer() {
        this.server.listen(this.port)
    }


}

module.exports = Server;