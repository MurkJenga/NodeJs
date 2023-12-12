require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        // Add more intents as needed based on your bot's functionality
    ],
});

const prefix = '/'; // Customize the bot's command prefix

client.once('ready', () => {
    console.log('Bot is ready!');
}); 


// Add your bot token here
client.login(process.env.DISCORD_TOKEN);
