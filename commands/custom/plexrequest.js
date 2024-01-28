const { SlashCommandBuilder } = require('discord.js');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')
const { formatCSTTime } = require('../../custom_functions/miscFunctions.js')
const { sendJsonRequest } = require('../../custom_functions/apiFunctions.js')

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
        const postData = {
            type: 'plex',
            request_text: request,
            request_time: formatCSTTime(interaction.createdAt)
        };
        sendJsonRequest(postData, 'request')  
        console.log(`${interaction.user.username} requested a PLEX request @ ${formatCSTTime(interaction.createdAt)}`)
        await interaction.reply({ embeds: [createdEmbed('cc9316', `Plex Request`, `Will Have this uploaded as soon as possible.\n\n Request: ${request}`)], ephemeral: false })

    }
}