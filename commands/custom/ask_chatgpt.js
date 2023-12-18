const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const chatgpt_key = require('../../config.json');
require('dotenv').config();

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

            // Get the question from the user
            const question = interaction.options.getString('question');

            // Replace 'YOUR_CHATGPT_API_KEY' with your actual ChatGPT API key
            const chatGPTApiKey = process.env.chatgpt_key;

            //const chatGPTApiKey = chatgpt_key;
            const chatGPTApiEndpoint = 'https://api.openai.com/v1/chat/completions';
             
            const response = await axios.post(
                chatGPTApiEndpoint,
                {
                    model: 'gpt-3.5-turbo-0613',   
                    max_tokens: 150,
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
 
            await interaction.followUp(`ChatGPT says: ${chatGPTResponse}`);

        } catch (error) {
            console.error('Error processing ChatGPT question:', error);

            if (axios.isCancel(error)) {
                // Handle timeout error
                await interaction.followUp('ChatGPT is taking too long to respond. Please try again.');
            } else {
                // Log additional details about the error for debugging
                if (error.response) {
                    console.error('ChatGPT API Error Response:', error.response.data);
                }
                //console.log('ChatGPT API Key:', chatgpt_key);
                await interaction.followUp('An error occurred while processing your question. Please try again.');
            }
        }
    },
};
