const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')
const { returnJsonResponse } = require('../../custom_functions/apiFunctions.js')
const config = require('../../config.json')
        
module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Returns user stats based on user passed')
        .addUserOption(option => option.setName('user').setDescription('to show the targeted user\'s tag').setRequired(true)),

    async execute(interaction) { 
        try {
            const user = interaction.options.getUser('user')  
            const jsonResponse = await returnJsonResponse(`${config.apiHost}/user/${user.id}`); 
                        
            const userStats = jsonResponse[0]; // Access the first row  
            const embed = new EmbedBuilder()
                .setColor('fcf003')
                .setTitle(`${userStats.username}'s stats`)  
                .setDescription('Moms Basement Stats Below') 
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

        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didnt work', '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
	},
};