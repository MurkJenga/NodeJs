const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const { insert_request } = require('../../custom_functions/databaseFunctions.js')
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botrequest')
        .addStringOption(option =>
			option
				.setName('request')
                .setRequired(true)
				.setDescription('What feature do you want on the bot?'))
		.setDescription('Used to ask for new features on the bot'),
    async execute(interaction) { 
        const request = interaction.options.getString('request')
        insert_request('bot', request) 

        await interaction.reply({ embeds: [createdEmbed('a33600', `Bot Request`, `Will review this suggestion and let you know if my owner thinks its a worth it.\n\n Request: ${request} `)], ephemeral: false })

    }
}