const { SlashCommandBuilder } = require('discord.js');
const { createdEmbed, getFormattedDate } = require('../../custom_functions/miscFunctions.js');
const { returnJsonResponse } = require('../../custom_functions/apiFunctions.js'); 
const config = require('../../config.json');
const { DateTime } = require('luxon');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('total')
    .setDescription('Returns total messages per user')
    .addStringOption(option =>
      option.setName('date')
          .setDescription('Total messages based on this point in time')),
async execute(interaction) {

  function isValidDateFormat(dateString) {
    // Regular expression to match yyyy-mm-dd format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
    }
    const date = interaction.options.getString('date') || getFormattedDate();
    
    console.log(getFormattedDate())

    if (isValidDateFormat(date)) {
      try {  
        const jsonResponse = await returnJsonResponse(`${config.apiHost}/message/total/${date}`);
        const data = jsonResponse.map(row => row.stats).join('\n');
          
        await interaction.reply({ embeds: [createdEmbed('8c03fc', `Total Messages per User As of ${date}`, data)], ephemeral: false });
      } catch (error) {
        await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didn\'t work', '')], ephemeral: false });
        console.error('Error reading data from MySQL:', error);
      }
    } else {
      await interaction.reply({ embeds: [createdEmbed('FF0000', 'Use yyyy-mm-dd format', '')], ephemeral: false });
    }   
  },
};
