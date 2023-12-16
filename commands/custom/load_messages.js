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
            
            // Loop through all channels in the guild
            const channelsList = interaction.guild.channels.cache.map((channel) => {
                return `Channel ID: ${channel.id}, Channel Name: ${channel.name}, Type: ${channel.type}`;
            });

            // Join the channel information into a string
            const channelsInfo = channelsList.join('\n');
            console.log(channelsInfo)
            
            await interaction.reply({ embeds: [embed_granted], ephemeral: false }); 
        } else {
            await interaction.reply({ embeds: [embed_denied], ephemeral: false }); 
        }    
    },
}; 