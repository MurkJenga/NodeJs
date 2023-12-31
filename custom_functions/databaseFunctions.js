const mysql = require('mysql2/promise');
const config = require('../config.json');
const { executeQuery } = require('../custom_functions/executeQuery.js')

const pool = mysql.createPool(config.mysql);   

// When a new message is created, insert message
async function insert_message(channelId, guildId, messageId, createdTime, content, authorId) { 
    try {
        const sql = 'INSERT INTO message (channel_id, guild_id, message_id, created_dtm, content_txt, og_content_txt, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const values = [channelId, guildId, messageId, createdTime, content, content, authorId]
        const rows = await executeQuery(sql, values);
        //console.log(`Inserted ${rows.affectedRows} message(s) @ ${createdTime}`);
    } catch (error) {
        console.error('Error inserting data into MySQL:', error) 
    }
}

async function deactive_message(messageId, channelId, guildId) {
    try {
        const sql = 'update message set is_active = 0 where message_id = ?'
        const values = [messageId]
        const rows = await executeQuery(sql, values);
        //console.log(`Deactivated ${rows.affectedRows} message(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error deactivating message data into MySQL:', error);
    }   
}

async function update_message(updated_time, messageId, content, channelId, guildId) { //, authorId
    try {
        const sql = 'update message set last_modified_dtm = ?, content_txt = ? where message_id = ?'
        const values = [updated_time, content, messageId]
        const rows = await executeQuery(sql, values);
        //console.log(`Updated ${rows.affectedRows} message(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error updating message data into MySQL:', error);
    }  
    //console.log(`Updated message ${messageId} to ${content} in ${channelId} channel @ ${updated_time}`)
} 

async function remove_reaction(userId, messageId, emojiName, emojiId, channelId, guildId, updateTIme) {
    try {
        const sql = 'update reaction set removed_dtm = ?, is_active = 0 where message_id = ? and user_id = ? and emoji_txt = ?'
        const values = [updateTIme, messageId, userId, emojiName]
        const rows = await executeQuery(sql, values);
        //console.log(`Removed ${rows.affectedRows} reaction(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error updating reaction data into MySQL:', error);
    } 
}

async function add_reaction(userId, messageId, emojiName, emojiId, channelId, guildId, updateTIme) { 
    try {
        const sql = 'insert into reaction (user_id, message_id, emoji_txt, emoji_id, channel_id, guild_id, added_dtm) value (?,?,?,?,?,?,?)';
        const values = [userId, messageId, emojiName, emojiId, channelId, guildId, updateTIme]
        const rows = await executeQuery(sql, values);
        //console.log(`Inserted ${rows.affectedRows} reaction(s) @ ${cstDatetime}`);
    } catch (error) {
        console.error('Error inserting reaction data into MySQL:', error);
    }
}

async function insert_channel(channel_name, channel_id, channel_created_dtm, channel_type, server_name, server_id) {  
    try {
        const sql = 'INSERT INTO channel (channel_txt, channel_id, created_dtm, channel_type, guild_txt, guild_id) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [channel_name, channel_id, channel_created_dtm, channel_type, server_name, server_id];
        const rows = await executeQuery(sql, values);
        console.log(`Inserted ${rows.affectedRows} channel(s)`);
    } catch (error) {
        console.error('Error inserting channel data into MySQL:', error);
    }
}
//user.userId, user.username, user.joinDate, user.nickname, user.isBot
async function insert_user(user_id, username, join_dtm, nickname, isBot) {  
    try {
        const sql = 'INSERT INTO user (user_id, username, join_dtm, nickname, isBot) VALUES ( ?, ?, ?, ?, ?)';
        const values = [user_id, username, join_dtm, nickname, isBot];
        const rows = await executeQuery(sql, values);
        console.log(`Inserted ${rows.affectedRows} user(s) `);
    } catch (error) {
        console.error('Error inserting user data into MySQL:', error);
    }
}

async function insert_request(type, request_text, request_time) {  
    try {
        const sql = 'INSERT INTO request (type, request_txt, request_dte) VALUES ( ?, ?, ?)';
        const values = [type, request_text, request_time];
        const rows = await executeQuery(sql, values); 
    } catch (error) {
        console.error('Error inserting request data into MySQL:', error);
    }
}

module.exports = { insert_request, insert_message, deactive_message, update_message, remove_reaction, add_reaction, insert_channel, insert_user };
