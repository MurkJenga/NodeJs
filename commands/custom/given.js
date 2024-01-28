const { SlashCommandBuilder } = require('discord.js'); 
const { createdEmbed } = require('../../custom_functions/miscFunctions.js'); 
const { returnJsonResponse } = require('../../custom_functions/apiFunctions.js');
const config = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('given')
    .addStringOption(option =>
      option
        .setName('emoji')
        .setRequired(true)
        .setDescription('What emoji do you want to see stats for?'))
    .setDescription('Return the total emojis given for the provided emoji'),

  async execute(interaction) {
    const emoji = interaction.options.getString('emoji');        
    const jsonResponse = await returnJsonResponse(`${config.apiHost}/emoji/given/${emoji}`);

    if (jsonResponse.length != 0) {
        try {
            const data = jsonResponse.map(row => row.stats).join('\n');
            await interaction.reply({ embeds: [createdEmbed('a33600', `Total Emojis Given For: ${emoji}`, String(data))], ephemeral: false });

        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didn\'t work', '')], ephemeral: false });
            console.error('Error reading data from API:', error);
        }
    } else {
        await interaction.reply({ embeds: [createdEmbed('1800a3', `There have been no reactions for ${emoji}`)], ephemeral: false }); 
    }
}}
