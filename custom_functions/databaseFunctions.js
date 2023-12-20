const mysql = require('mysql2/promise');
const { hostname, user, password, database } = require('../config.json');
const { getFormattedDatetime } = require('./getFormattedDatetime.js')
const { executeQuery } = require('../custom_functions/executeQuery.js')

const pool = mysql.createPool({
    host: hostname,
    user: user,
    password: password,
    database: database,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 5
});  
const cstDatetime = getFormattedDatetime()

// When a new message is created, insert message
async function insert_message(channelId, guildId, messageId, createdTime, content, authorId) { 
    try {
        const sql = 'INSERT INTO message (channel_id, guild_id, message_id, created_dtm, content_txt, og_content_txt, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const values = [channelId, guildId, messageId, cstDatetime, content, content, authorId]
        const rows = await executeQuery(sql, values);
        console.log(`Inserted ${rows.affectedRows} message(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error inserting data into MySQL:', error) 
    }
}

async function deactive_message(messageId, channelId, guildId) {
    try {
        const sql = 'update message set is_active = 0 where message_id = ?'
        const values = [messageId]
        const rows = await executeQuery(sql, values);
        console.log(`Deactivated ${rows.affectedRows} message(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
    }   
}

async function update_message(updated_time, messageId, content, channelId, authorId, guildId) {
    try {
        const sql = 'update message set last_modified_dtm = ?, content_txt = ? where message_id = ?'
        const values = [cstDatetime, content, messageId]
        const rows = await executeQuery(sql, values);
        console.log(`Updated ${rows.affectedRows} message(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
    }  
    console.log(`${authorId} updated message ${messageId} to ${content} in ${channelId} channel`)
} 

async function remove_reaction(userId, messageId, emojiName, emojiId, channelId, guildId) {
    try {
        const sql = 'update reaction set removed_dtm = ?, is_active = 0 where message_id = ? and user_id = ? and emoji_txt = ?'
        const values = [cstDatetime, messageId, userId, emojiName]
        const rows = await executeQuery(sql, values);
        console.log(`Removed ${rows.affectedRows} reaction(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
    } 
}

async function add_reaction(userId, messageId, emojiName, emojiId, channelId, guildId) { 
    try {
        const sql = 'insert into reaction (user_id, message_id, emoji_txt, emoji_id, channel_id, guild_id, added_dtm) value (?,?,?,?,?,?,?)';
        const values = [userId, messageId, emojiName, emojiId, channelId, guildId, cstDatetime]
        const rows = await executeQuery(sql, values);
        console.log(`Inserted ${rows.affectedRows} reaction(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
    }
}

async function insert_channel(channel_name, channel_id, channel_created_dtm, channel_type, server_name, server_id) {  
    try {
        const sql = 'INSERT INTO channel (channel_txt, channel_id, created_dtm, channel_type, guild_txt, guild_id) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [channel_name, channel_id, channel_created_dtm, channel_type, server_name, server_id];
        const rows = await executeQuery(sql, values);
        console.log(`Inserted ${rows.affectedRows} channel(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
    }
}
//user.userId, user.username, user.joinDate, user.nickname, user.isBot
async function insert_user(user_id, username, join_dtm, nickname, isBot) {  
    try {
        const sql = 'INSERT INTO user (user_id, username, join_dtm, nickname, isBot) VALUES ( ?, ?, ?, ?, ?)';
        const values = [user_id, username, join_dtm, nickname, isBot];
        const rows = await executeQuery(sql, values);
        console.log(`Inserted ${rows.affectedRows} user(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
    }
}

module.exports = { insert_message, deactive_message, update_message, remove_reaction, add_reaction, insert_channel, insert_user };