const Server = require("./classes/serverClass");
const port = 8000;
const endpoint = "*";

const server = new Server(port, endpoint)
server.startServer();