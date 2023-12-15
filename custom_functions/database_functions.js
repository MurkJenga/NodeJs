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
 

module.exports = { insert_message, deactive_message, update_message};
