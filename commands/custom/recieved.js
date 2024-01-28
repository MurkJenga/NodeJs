const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); 
const { createdEmbed } = require('../../custom_functions/miscFunctions.js') 
const { returnJsonResponse } = require('../../custom_functions/apiFunctions.js')
const config = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('recieved')
        .addStringOption(option =>
			option
				.setName('emoji')
                .setRequired(true)
				.setDescription('What emoji do you want to see stats for?'))
		.setDescription('Return the total emojis recieved for the provided emoji'),

    async execute(interaction) { 
        const emoji = interaction.options.getString('emoji')        
        const jsonResponse = await returnJsonResponse(`${config.apiHost}/emoji/recieved/${emoji}`);

        if (jsonResponse.length != 0) {
            const data = jsonResponse.map(row => row.stats).join('\n');   
            await interaction.reply({ embeds: [createdEmbed('00a398', `Total Emojis Recieved For: ${emoji}`, String(data))], ephemeral: false })
        } else { 
            await interaction.reply({ embeds: [createdEmbed('1800a3', `There have been no reactions for ${emoji}`)], ephemeral: false }); 
        }
    }
}