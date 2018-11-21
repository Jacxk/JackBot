const mysql = require('mysql');
const config = require('../config.json');
const index = require('../index.js');

const pool = module.exports.createConnection = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    database: config.database.customCmdDB,
    password: config.database.password
});


pool.getConnection((err, connection) => {
    const statement = "SELECT * FROM ?";
    connection.query(statement, [guild.id], (err, result) => {

    });
});