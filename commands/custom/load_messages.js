const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loaddata')
        .setDescription('Reload all messages and emojis'),
    async execute(interaction) { 
        const embedColor = parseInt('00FF00', 16); 
        const embed_granted = {
            color: parseInt('00FF00', 16),
            title: 'Status:',
            description: 'Loading data'
        }
        const embed_denied = {
            color: parseInt('FF0000', 16),
            title: 'Status:',
            description: 'Access Denied'
        }
        if (interaction.user.id == '553337834090659899') {
            try {
                let totalMessages = 0
                // Loop through all channels in the guild
                for (const channel of interaction.guild.channels.cache.values()) { 
                    let lastMessageId

                    // Only loop through text channels
                    if (channel.type === 0) {
                        console.log(channel.name, channel.type, channel.id)
                        try {
                            const options = { limit: 100, before: lastMessageId };
                            const messages = await channel.messages.fetch(options);

                            if (messages.size > 0) {
                                messages.forEach((message) => {
                                    console.log(`Message ID: ${message.id}, Content: ${message.content}`);
                                    const fetchedMessage = message.channel.messages.fetch(message.id);

                                    if (message.reactions.cache.size > 0) {
                                        console.log("Reactions:");
                                        message.reactions.cache.forEach((reaction) => {
                                            
                                            console.log(`  Emoji: ${reaction.emoji.name}, Count: ${reaction.count}, Users: ${reaction.users}`)
                                               
                                        });
                                    } 
                                    Object.keys(fetchedMessage).forEach((prop)=> console.log(prop))
                                    //console.log(`  Emoji: ${fetchedMessage}`) 

                                    totalMessages += 1
                                });

                                // Update the lastMessageId for the next iteration
                                lastMessageId = messages.lastKey();
                                
                            } else {
                                // No more messages
                                break;
                            }
                        } catch (error) {
                            console.error('Error fetching messages:', error);
                            break;
                        } 
                    }
                }
                await interaction.reply({ embeds: [embed_granted], ephemeral: false });
                console.log(totalMessages)
            } catch (error) {
                console.error('Error iterating through channels:', error);
                await interaction.reply({ embeds: [embed_denied], ephemeral: false });
            } 
        } else {
            await interaction.reply({ embeds: [embed_denied], ephemeral: false });
        }
    },
};