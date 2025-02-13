const mysql = require("mysql");
require("dotenv").config();

class DBConfig {
    static config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    };

    static createDB = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    static createTable = `CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.${process.env.DB_TABLE}
        (patientid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), dateOfBirth DATETIME)`;

    #database;

    constructor() {
        this.connectToDB();
    }

    async connectToDB() {
        // Create database if it doesn't exist
        this.#database = mysql.createConnection(DBConfig.config);
        await this.queryDB(DBConfig.createDB);
        await this.queryDB(`USE ${process.env.DB_NAME}`);
        await this.queryDB(DBConfig.createTable);
    }

    async queryDB(query, params = []) {
        return new Promise((resolve, reject) => {
            this.#database.query(query, params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    getDatabase() {
        return this.#database;
    }
}

exports.DBConfig = DBConfig;