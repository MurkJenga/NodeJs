const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); 
const { createdEmbed } = require('../../custom_functions/miscFunctions.js') 
const { returnJsonResponse } = require('../../custom_functions/apiFunctions.js')
const config = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('last30')
		.setDescription('Returns user stats based on user passed from the last 30 days')
        .addUserOption(option => option.setName('user').setDescription('to show the targeted user\'s tag').setRequired(true)),
    async execute(interaction) { 
        try {
            const user = interaction.options.getUser('user')  
            const jsonResponse = await returnJsonResponse(`${config.apiHost}/user/last30/${user.id}`); 

            if (jsonResponse.length != 0) {
                const userStats = jsonResponse[0]  
                const embed = new EmbedBuilder()
                .setColor('6e34eb')
                .setTitle(`${userStats.username}'s stats`)  
                .setDescription('The stats for the last 30 days') 
                .addFields(
                    { name: 'Join Date', value: userStats.joinDate, inline: true}, 
                    { name: 'Total Messages', value: String(userStats.totalMsgs), inline: true },
                    { name: 'Avg Words Per Message', value: userStats.averageWrds, inline: true },
                    { name: 'Last Message Sent', value: userStats.lastMsg, inline: true },
                    { name: 'Total Words', value: userStats.totalWrds, inline: true },
                    { name: 'Average Messages Per Day', value: userStats.avgPerDay, inline: true },
                    { name: 'Emojis Given', value: String(userStats.reactGiv), inline: true },
                    { name: 'Emojis Recieved', value: String(userStats.reactRec), inline: true },
                    { name: 'Top Emoji Used', value: userStats.topReact, inline: true },
                    ) 
                
            await interaction.reply({ embeds: [embed], ephemeral: false });
        } else {
            await interaction.reply({ embeds: [createdEmbed('1800a3', `There are no stats for user ID ${user}`)], ephemeral: false }); 
        }

        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didnt work', '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
	},
};