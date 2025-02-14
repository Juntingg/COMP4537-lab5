const DBConfig = require("./DBConfig");

class DAO {
    static async insertPatient(name, dateOfBirth) {
        const sql = `INSERT INTO ${process.env.DB_TABLE} (name, dateOfBirth) VALUES (?, ?)`;
        return DBConfig.query(sql, [name, dateOfBirth]);
    }

    static async getPatientById(patientId) {
        const sql = `SELECT * FROM ${process.env.DB_TABLE} WHERE patientid = ?`;
        return DBConfig.query(sql, [patientId]);
    }

    static async getAllPatients() {
        const sql = `SELECT * FROM ${process.env.DB_TABLE}`;
        return DBConfig.query(sql);
    }
}

module.exports = DAO;