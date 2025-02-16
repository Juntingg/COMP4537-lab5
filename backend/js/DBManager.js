// This code was assisted by ChatGPT, OpenAI.
const mysql = require("mysql");
require("dotenv").config();

class DBManager {
    static config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    };

    #database;
    #createDB;
    #createTable;

    constructor() {
        this.#createDB = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
        this.#createTable = `CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.${process.env.DB_TABLE} 
            (patientid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), dateOfBirth DATETIME)`;
        this.#connectDatabase();
    }

    // asynchronous method that executes a SQL query
    async queryDB(query) {
        return new Promise((res, rej) => { // Promise that resolves with the query result or rejects with an error
            this.#database.query(query, (err, result) => {
                if (err) return rej(err);
                res(result);
            });
        });
    }

    async #connectDatabase() {
        this.#database = mysql.createConnection(DBManager.config); // creates a connection to the MySQL server using config
        await this.queryDB(this.#createDB); // executes the CREATE DATABASE query to create the database if it doesn’t exist
        this.queryDB(`USE ${process.env.DB_NAME}`); // switches to the specified database
        this.queryDB(this.#createTable); // query to create the table if it doesn’t exist
    }
}

exports.DBManager = DBManager;