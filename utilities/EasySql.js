const mysql = require('mysql');
const config = require('../config.json');

const connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    database: config.database.database,
    password: config.database.password
});

export class EasySql {
    static select(select: String, from: String, where?: String, is?: Array) {
        return new Promise((resolve, reject) => {
            const statement = `SELECT ${select} FROM ${from} WHERE ${where} = ?;`;

            connection.query(statement, [is], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static insert(into: String, keys: Array, values: Array) {
        return new Promise((resolve, reject) => {
            let value = [];
            for (let i = 0; i < keys.length; i++)
                value.push('?');
            const statement = `INSERT INTO ${into} (${keys}) VALUES (${value.join(', ')});`;

            connection.query(statement, [values], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}