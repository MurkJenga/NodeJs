// When a new message is created, insert message
function insert_message(channelId, guildId, messageId, createdTime, content, authorId) {
    console.log(channelId, guildId, messageId, createdTime, content, authorId)
}

function deactive_message(messageId, channelId, guildId) {
    console.log(`MessageId deleted: ${messageId} in the ${channelId} channel`)
}

function update_message(updated_time, messageId, content, channelId, authorId, guildId) {
    console.log(`${authorId} updated message ${messageId} to ${content} in ${channelId} channel`)
}

function remove_reaction(userId, messageId, emojiName, emojiId, channelId, guildId) {
    console.log(`${userId} removed ${emojiName} on message ${messageId} in ${channelId} channel`)
}

function add_reaction(userId, messageId, emojiName, emojiId, channelId, guildId) {
    console.log(`${userId} added ${emojiName} on message ${messageId} in ${channelId} channel`)
}
  
module.exports = { insert_message, deactive_message, update_message, remove_reaction, add_reaction};
