// This code was assisted by ChatGPT, OpenAI.
const Server = require("./js/server");
const port = 8000;
const endpoint = "/api/v1/sql/";

const server = new Server(port, endpoint)
server.startServer();