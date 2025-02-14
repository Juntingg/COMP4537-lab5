const mysql = require("mysql");
require("dotenv").config();
class DBConfig {

    static config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }

    static createDB = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    static createTable = `CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.${process.env.DB_TABLE}
        (patientid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), dateOfBirth dateTime)`;

    #database;

    constructor() {
        this.#connectToDB();
    }

    async queryDB(query) {
        return new Promise((res, rej) => {
            this.#database.query(query, (err, result) => {
                if (err) return rej(err);
                res(result);
            });
        });
    }

    async #connectToDB() {
        // Create database if it doesn't exist
        this.#database = mysql.createConnection(DBConfig.config);
        await this.queryDB(DBConfig.createDB);
        this.queryDB(`USE ${process.env.DB_NAME}`);
        this, this.queryDB(DBConfig.createTable);
    }

}

exports.DBConfig = DBConfig;