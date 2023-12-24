const { SlashCommandBuilder } = require('discord.js');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Returns the slash commands'),
    async execute(interaction) { 
        try {

          const explain = `Below are the new updates made as of 12/24 \n
                           - ChatGPT command enhancements, more reliable \n
                           - Reformatted some of the responses such as plex requests and total\n
                           - Support for Jakes plex bot`
          await interaction.reply({ embeds: [createdEmbed('ffffff', `New Updates!`, explain)], ephemeral: false })
        } catch (error) {
          console.error('Error fetching global slash commands:', error);
        }
      }
    }