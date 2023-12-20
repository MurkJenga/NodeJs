const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
        const embed = {
            color: parseInt('faa1bf', 16),
            title: 'Server Info:',
            description: `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
        }
        
        await interaction.reply({ embeds: [embed], ephemeral: false });
	},
};