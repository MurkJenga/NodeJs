const { DateTime } = require('luxon');
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
function getFormattedDatetime() {
    value =  DateTime.fromJSDate(new Date()).setZone('America/Chicago').toFormat('yyyy-MM-dd HH:mm:ss');
    return value
}

function formatDatetime(datetime) {
    return DateTime.fromMillis(datetime).toFormat('yyyy/MM/dd HH:mm:ss')
} 

function formatDate(datetime) {
    return DateTime.fromISO(datetime).toFormat('yyyy/MM/dd')
} 

function formatCSTTime(timestamp) {
    const dateObject = new Date(timestamp); 
	const cstOffset = -6 * 60; 
	dateObject.setMinutes(dateObject.getMinutes() + cstOffset);
	return dateObject.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function createdEmbed(hex, title, desc) {
    return {
        color: parseInt(hex, 16), 
        title: title,
        description: desc
    } 
}

function randomReply() {
    const responses = [
        'Milk, milk, lemonade, \'round the corner fudge is made', 
        'She gave me a rimjob', 
        'Now both of them can call me \'daddy\'', 
        'I be destroying her ass', 
        'I bang her harder than a screen door in a hurricane', 
        'She know who really gives it to her good', 
        'Best door mat I\'ve ever found on the side of the road', 
        'I\'ve been considering a better model lately', 
        'Should be illegal for ass to be that easy',
        'I fucked her like Heath Ledger fucked Jake Gyllenhaal in Brokeback Mountain.']
    const randomIndex = Math.floor(Math.random() * responses.length);
    
    return responses[randomIndex]
}

module.exports = { createdEmbed, randomReply, formatCSTTime, getFormattedDatetime, formatDatetime, formatDate, executeQuery }