const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { deactive_message, update_message, insert_message, remove_reaction, add_reaction} = require('./custom_functions/databaseFunctions.js');
const { createdEmbed, randomReply} = require('./custom_functions/miscFunctions.js')
const { getFormattedDatetime } = require('./custom_functions/getFormattedDatetime.js')

const client = new Client({ intents: [
	GatewayIntentBits.GuildEmojisAndStickers, 
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent
] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
} 

const options = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	timeZone: 'America/Chicago',  
  }; 

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});  

client.on('messageCreate', async (message) => { 

    if (message.content.toLowerCase().includes('peter') && message.content.toLowerCase().includes('mom')) {
		message.react('<:penis:285904916742930432>')
		message.reply({ embeds: [createdEmbed('682352', randomReply() )] } )
	}  

	const date = new Date(message.createdTimestamp); 
	const formattedDate = date.toLocaleString('en-US', options); 
	insert_message(message.channelId, message.guildId, message.id, formattedDate, message.content, message.author.id)
});  

client.on('messageUpdate', (oldMessage, newMessage) => { 
	const date = getFormattedDatetime() 
	console.log(`${newMessage.author.username} updated a message from ${oldMessage.content} to ${newMessage.content}`)

	update_message(date, newMessage.id, newMessage.content, newMessage.channelId, newMessage.guildId)
	
});

client.on('messageDelete', async (message) => {
	deactive_message(message.id, message.channelId, message.guildId )
});

client.on('messageReactionAdd', (reaction, user) => {
	add_reaction(user.id, reaction.message.id, reaction._emoji.name, reaction._emoji.id, reaction.message.channelId, reaction.message.guildId)
});

client.on('messageReactionRemove', (reaction, user) => {
	remove_reaction(user.id, reaction.message.id, reaction._emoji.name, reaction._emoji.id, reaction.message.channelId, reaction.message.guildId)
});  

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);	 