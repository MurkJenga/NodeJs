const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pong')
        .setDescription('Replies with piss off!'),
    async execute(interaction) { 
        const embedColor = parseInt('0099ff', 16); 
        const embed = {
            color: embedColor,
            title: 'Pong!',
            description: 'Piss off!',
        };
 
        await interaction.reply({ embeds: [embed], ephemeral: false }); 
        //console.log(interaction);
    },
};
