const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); 
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')
require('dotenv').config(); 

const plex_Token = process.env.plex_Token;
const plexBaseUrl = process.env.plexServer;  

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plexsearch')
        .addStringOption(option =>
            option
                .setName('content')
                .setRequired(true)
                .setDescription('What content are you looking for?'))
        .setDescription('Search Jengas Plex Library'),
    async execute(interaction) {
        try { 
            const content = interaction.options.getString('content');
            const params = {
                query: encodeURIComponent(content),
            };
            const response = await axios.get(`${plexBaseUrl}/search`, {
                headers: {
                    'X-Plex-Token': plex_Token,
                },
                params,
            });
            const mediaContainer = response.data.MediaContainer; 
            
            if (mediaContainer.Metadata){
                const results = mediaContainer.Metadata.map(item => ({
                    title: item.title,
                    type: item.type,
                })); 

                const formattedResults = results.map(result => `**${result.title}**: ${result.type}`).join('\n');
                //console.log(formattedResults);
                await interaction.reply({ embeds: [createdEmbed('04d10e', `Content Matching: ${content}`, formattedResults)], ephemeral: false });
                
            } else { 
                await interaction.reply({ embeds: [createdEmbed('ff0000', `No Content Matching: ${content}`)], ephemeral: false })
            }

        } catch (error) {
            console.error('Error searching Plex library:', error);
            await interaction.reply('An error occurred while searching the Plex library.');
        }
    },
};
