const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'Node-Ecommerce',
    password: 'ker998Ns'
});

module.exports = pool.promise();