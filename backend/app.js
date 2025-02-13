const Server = require("./classes/server");
const port = 8000;
const endpoint = "/api/v1/sql/";

const server = new Server(port, endpoint)
server.startServer();