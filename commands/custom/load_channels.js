const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshchannels')
        .setDescription('Refreshes channel data'),
    async execute(interaction) {
        const embed_denied = {
            color: parseInt('FF0000', 16),
            title: 'Status:',
            description: 'Access Denied'
        }
        const embed_granted = {
            color: parseInt('00FF00', 16),
            title: 'Status:',
            description: 'Refreshing channel data'
        }
        try {
            // Check if the user has the necessary permissions (optional)
            if (interaction.user.id != '553337834090659899') {
                await interaction.reply({ embeds: [embed_denied], ephemeral: false });
            }

            const channels = interaction.guild.channels.cache;
            const channelInfo = [];

            // Iterate through each channel
            channels.forEach(channel => {
                // Extract channel information
                const createdDate = new Date(channel.createdTimestamp).toLocaleDateString();
                const info = {
                    name: channel.name,
                    id: channel.id,
                    createdDate: createdDate,
                    type: channel.type,
                };

                // Push the channel information to the array
                channelInfo.push(info);
            });

            // Log the channel information
            channelInfo.forEach(channel_element => {
                console.log(channel_element.name, channel_element.id, channel_element.createdDate, channel_element.type)
            }) 

            await interaction.reply({ embeds: [embed_granted], ephemeral: false });

        } catch (error) {
            console.error('Error listing channels:', error);
            await interaction.reply('An error occurred while listing channels.');
        }
    },
};
