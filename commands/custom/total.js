const { SlashCommandBuilder } = require('discord.js');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js');
const { returnJsonResponse } = require('../../custom_functions/apiFunctions.js'); 
const config = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('total')
    .setDescription('Returns total messages per user'),

async execute(interaction) {
    try { 

        const jsonResponse = await returnJsonResponse(`${config.apiHost}/message/total`); 
        const data = jsonResponse.map(row => row.stats).join('\n');
        
        interaction.reply({ embeds: [createdEmbed('8c03fc', 'Total Messages per User', data)], ephemeral: false });
    } catch (error) {
      await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didn\'t work', '')], ephemeral: false });
      console.error('Error reading data from MySQL:', error);
    }
  },
};
