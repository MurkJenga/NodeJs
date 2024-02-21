const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('genimage')
    .setDescription('Generate an image using AI')
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('The prompt for generating your image')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    try { 
      const prompt = interaction.options.getString('prompt');
      const openai = new OpenAI({apiKey: process.env.chatgpt_key});
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      await interaction.followUp(response.data[0].url);
      //console.log(response.data[0].url)

    } catch (error) {
      console.error('Error generating image:', error);
      await interaction.followUp('An error occurred while generating the image.');
    }
  },
};
