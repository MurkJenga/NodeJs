const { SlashCommandBuilder } = require('discord.js');
const { insert_channel } = require('../../custom_functions/databaseFunctions') 
const { formatDatetime } = require('../../custom_functions/getFormattedDatetime')

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
            description: 'Refreshed channel information'
        }
        try {
            if (interaction.user.id != '553337834090659899') {
                await interaction.reply({ embeds: [embed_denied], ephemeral: false });
            } else {

            const channels = interaction.guild.channels.cache;
            const channelInfo = [];

            channels.forEach(channel => {
                const createdDate = formatDatetime(channel.createdTimestamp) 
                const info = {
                    name: channel.name,
                    id: channel.id,
                    createdDate: createdDate,
                    type: channel.type,
                    server: interaction.guild.name,
                    server_id: interaction.guild.id
                };

                channelInfo.push(info);
            });

            channelInfo.forEach(c => {
                insert_channel(c.name, c.id, c.createdDate, c.type, c.server, c.server_id)
            }) 
            await interaction.reply({ embeds: [embed_granted], ephemeral: false });
        }
    } catch (error) {
        console.error('Error listing channels:', error);
        await interaction.reply('An error occurred while listing channels.');
        }
    },
};