const { hostname, user, password, database } = require('../config.json');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: hostname,
    user: user,
    password: password,
    database: database,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 5
});  

async function executeQuery(sql, values) {
    try {
        const [rows, fields] = await pool.execute(sql, values);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;  
    }
}

module.exports = { executeQuery };
