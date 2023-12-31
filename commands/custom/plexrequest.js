const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const { insert_request } = require('../../custom_functions/databaseFunctions.js')
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')
const { formatCSTTime } = require('../../custom_functions/getFormattedDatetime.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('plexrequest')
        .addStringOption(option =>
			option
				.setName('request')
                .setRequired(true)
				.setDescription('The content wanted on plex'))
		.setDescription('Records a request to upload plex'),
    async execute(interaction) { 
        const request = interaction.options.getString('request')
        insert_request('plex', request, formatCSTTime(interaction.createdAt))  

        console.log(`${interaction.user.username} requested a PLEX request @ ${formatCSTTime(interaction.createdAt)}`)

        await interaction.reply({ embeds: [createdEmbed('cc9316', `Plex Request`, `Will Have this uploaded as soon as possible.\n\n Request: ${request}`)], ephemeral: false })

    }
}