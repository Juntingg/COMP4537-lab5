"use strict"

const http = require("http");
const url = require("url");
const msgs = require("./lang/en");

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

    }
    startServer() {
        this.server.listen(this.port)
    }


}