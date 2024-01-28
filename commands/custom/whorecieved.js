const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js');
const { returnJsonResponse } = require('../../custom_functions/apiFunctions.js'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whorecieved')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('to show the targeted user\'s tag')
                .setRequired(true))
        .addStringOption(option =>
			option
				.setName('emoji')
                .setRequired(true)
				.setDescription('What emoji do you want to see stats for?'))
		.setDescription('Returns list of users and the times they gave an emoji to the specified user'),

    async execute(interaction) { 
        try { 
            const emoji = interaction.options.getString('emoji')   
            const user = interaction.options.getUser('user')   

            const jsonResponse = await returnJsonResponse(`${config.apiHost}/emoji/whorecieved/${user.id}/${emoji}`);
            
            if (jsonResponse.length != 0){
                const data =  jsonResponse.map(row => row.stats).join('\n')
                await interaction.reply({ embeds: [createdEmbed('a0f79c', `Users who recieved the most ${emoji} from ${user.username}`, data)], ephemeral: false })
            } else {
                await interaction.reply({ embeds: [createdEmbed('263d25', `${user.username} never gave ${emoji} to anyone`)], ephemeral: false })

            }
        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didnt work', '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
	},
};