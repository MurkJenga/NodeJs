const { SlashCommandBuilder } = require('discord.js');
const { returnJsonResponse } = require('../../custom_functions/apiFunctions.js');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js') 
const config = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topmessage')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('to show the targeted user\'s tag')
                .setRequired(true)) 
		.setDescription('Return the message that has the most reactions on it for a user'),
    async execute(interaction) { 
        //localhost:3000/message/topmessage/553337834090659899 
        const user = interaction.options.getUser('user')  
        const jsonResponse = await returnJsonResponse(`${config.apiHost}/message/topmessage/${user.id}`);
        const data = jsonResponse[0]
        
        try {
            if (data.totalReactions > 0){
            await interaction.reply({ embeds: [createdEmbed('ae00ff', `Top Reacted Message For ${user.username}`, `${data.totalReactions} emojis: ${data.link}`)], ephemeral: false })
        } else {
            await interaction.reply({ embeds: [createdEmbed('FF0000', `${user.username} has no message above 0 `)], ephemeral: false })
        }
        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', `${user.username} has no message above 0`, '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
     
           // await interaction.reply({ embeds: [createdEmbed('ff0000', `This did not work`)], ephemeral: false })
        

        
    }
}