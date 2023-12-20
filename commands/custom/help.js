const { SlashCommandBuilder } = require('discord.js');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Returns the slash commands'),
    async execute(interaction) { 
        try {
           
          for (const key in interaction) {
            if (interaction.hasOwnProperty(key)) {
              console.log(`${key}: ${interaction[key]}`);
            }
          }
          console.log('Global Slash Commands:');
        } catch (error) {
          console.error('Error fetching global slash commands:', error);
        }
          await interaction.reply({ embeds: [createdEmbed('FF0000', 'Command')], ephemeral: false });
      }
    }