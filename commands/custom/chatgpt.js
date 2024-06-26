const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); 
require('dotenv').config(); 
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Ask ChatGPT a question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to ask')
                .setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply(); 
            const question = interaction.options.getString('question');

            const chatGPTApiKey = process.env.chatgpt_key;

            const chatGPTApiEndpoint = 'https://api.openai.com/v1/chat/completions';
             
            const response = await axios.post(
                chatGPTApiEndpoint,
                {
                    model: 'gpt-3.5-turbo-0613',   
                    max_tokens: 2000,
                    messages: [
                        { role: 'user', content: question },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${chatGPTApiKey}`,
                    },
                    timeout: 10000
                }
            ); 
            
            const chatGPTResponse = response.data.choices[0].message.content; 
            
            const embed = {
                color: parseInt('fc6703', 16),
                title: `ChatGPT was asked: ${question}`,
                description: chatGPTResponse
            }
            await interaction.followUp({ embeds: [createdEmbed('fc6703', `ChatGPT was asked: ${question}`, chatGPTResponse)], ephemeral: false })

        } catch (error) {
            console.error('Error processing ChatGPT question:', error);

            if (axios.isCancel(error)) {
                await interaction.followUp('ChatGPT is taking too long to respond. Please try again.');
            } else {
                if (error.response) {
                    console.error('ChatGPT API Error Response:', error.response.data);
                }
                await interaction.followUp('An error occurred while processing your question. Please try again.');
            }
        }
    },
};
