const Server = require("./classes/server");
const port = 8000;
const endpoint = "*";

const server = new Server(port, endpoint)
server.startServer();