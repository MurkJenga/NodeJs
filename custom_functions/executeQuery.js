const config = require('../config.json');
const mysql = require('mysql2/promise');

const pool = mysql.createPool(config.mysql);  
 

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
