const { SlashCommandBuilder } = require('discord.js');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')
const { formatCSTTime } = require('../../custom_functions/miscFunctions.js')
const { sendJsonRequest } = require('../../custom_functions/apiFunctions.js')

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
        const postData = {
            type: 'bot',
            request_text: request,
            request_time: formatCSTTime(interaction.createdAt)
          };
        sendJsonRequest(postData, 'request')  
        console.log(`${interaction.user.username} requested a BOT request @ ${formatCSTTime(interaction.createdAt)}`)
        await interaction.reply({ embeds: [createdEmbed('a33600', `Bot Request`, `Will review this suggestion and let you know if my owner thinks its a worth it.\n\n Request: ${request} `)], ephemeral: false })
    }
}