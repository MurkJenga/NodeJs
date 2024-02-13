const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js');
require('dotenv').config();

const plex_Token = process.env.plex_Token;
const plexBaseUrl = process.env.plexServer;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plexrecent')
        .addIntegerOption(option =>
			option
				.setName('days')
                .setRequired(true)
				.setDescription('See how many movies were added in this amount of days'))
        .setDescription('Search Jengas Plex Movie Library'),
    async execute(interaction) {
        try {
            const days = interaction.options.getInteger('days');
            const currentDate = new Date();
            const thirtyDaysAgo = new Date(currentDate);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);

            // Fetch all movies from Plex
            const response = await axios.get(`${plexBaseUrl}/library/sections`, {
                headers: {
                    'X-Plex-Token': plex_Token,
                }
            });
            const sections = response.data.MediaContainer.Directory;
            const movieSection = sections.find(section => section.type === 'movie');

            if (movieSection) {
                // Fetch movies from the movie section
                const moviesResponse = await axios.get(`${plexBaseUrl}/library/sections/${movieSection.key}/all`, {
                    headers: {
                        'X-Plex-Token': plex_Token,
                    }
                });
                const movieContainer = moviesResponse.data.MediaContainer;

                if (movieContainer.Metadata) {
                    const recentlyAddedMovies = movieContainer.Metadata.filter(item => {
                        const addedDate = new Date(item.addedAt * 1000);
                        return addedDate >= thirtyDaysAgo && addedDate <= currentDate;
                    });

                    // Map the filtered movies to desired format
                    const results = recentlyAddedMovies.map(movie => ({
                        title: movie.title,
                        addeddate: new Date(movie.addedAt * 1000),
                        audienceRating: movie.audienceRating
                    }));

                    const formattedResults = results.map(result => `**${result.title}**: \n    :calendar: ${result.addeddate.toISOString().split('T')[0]} \n    :popcorn: ${result.audienceRating}`).join('\n');
                    await interaction.reply({ embeds: [createdEmbed('04d10e', `Movies Added in Last ${days} Days:`, formattedResults)], ephemeral: false });
                } else {
                    await interaction.reply({ embeds: [createdEmbed('ff0000', 'No movies found.')], ephemeral: false });
                }
            } else {
                await interaction.reply({ embeds: [createdEmbed('ff0000', 'No movie section found.')], ephemeral: false });
            }

        } catch (error) {
            console.error('Error searching Plex movie library:', error);
            await interaction.reply('An error occurred while searching the Plex movie library.');
        }
    },
};
