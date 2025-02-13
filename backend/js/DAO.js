const mysql = require("mysql");
const { DBConfig } = require("./DBConfig");

class DAO {
    database;

    constructor() {
        const dbConfig = new DBConfig();
        this.database = dbConfig.getDatabase();
    }

    async queryDB(query, params = []) {
        return new Promise((resolve, reject) => {
            this.database.query(query, params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    async insertPatient(name, dateOfBirth) {
        const query = `INSERT INTO ${process.env.DB_TABLE} (name, dateOfBirth) VALUES (?, ?)`;
        return this.queryDB(query, [name, dateOfBirth]);
    }

    async getPatientById(patientId) {
        const query = `SELECT * FROM ${process.env.DB_TABLE} WHERE patientid = ?`;
        return this.queryDB(query, [patientId]);
    }
}

exports.DAO = DAO;