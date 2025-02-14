const mysql = require("mysql");
require("dotenv").config();

class DBConfig {
    static config = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    static async initializeDatabase() {
        // Create DB if it doesn't exist
        await this.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

        // Switch to the database
        await this.query(`USE ${process.env.DB_NAME}`);

        // Create table if it doesn't exist
        await this.query(`
      CREATE TABLE IF NOT EXISTS ${process.env.DB_TABLE} (
        patientid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        dateOfBirth DATETIME
      )
    `);
    }

    static query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.config.query(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = DBConfig;