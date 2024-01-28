const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { createdEmbed, randomReply} = require('./custom_functions/miscFunctions.js')
const { getFormattedDatetime, formatCSTTime } = require('./custom_functions/miscFunctions.js');
const { sendJsonRequest } = require('./custom_functions/apiFunctions.js');

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
	const postData = { 
		channelId: message.channelId,
		guildId: message.guildId, 
		messageId: message.id, 
		createdTime: formatCSTTime(message.createdAt), 
		content: message.content, 
		ogContent: message.content,
		authorId: message.author.id
	};
	sendJsonRequest(postData, 'message/insertmessage') 
	console.log(`${message.author.username} created a message @ ${formatCSTTime(message.createdAt)}`)
});  

client.on('messageUpdate', (oldMessage, newMessage) => { 
	const postData = { 
		updated_time: formatCSTTime(newMessage.editedAt),
		content: newMessage.content, 
		messageId: newMessage.id
	};
	sendJsonRequest(postData, 'message/updatemessage') 
	console.log(`${newMessage.author.username} updated a message from ${oldMessage.content} to ${newMessage.content} @ ${formatCSTTime(newMessage.editedAt)}`)

});

client.on('messageDelete', async (message) => {
	const postData = { 
		messageId: message.id
	};
	sendJsonRequest(postData, 'message/deletemessage') 
	console.log(`${message.author.username} deleted a message @ ${formatCSTTime(message.createdAt)}`)
});

client.on('messageReactionAdd', (reaction, user) => {
	const postData = {
		userId: user.id, 
		messageId: reaction.message.id, 
		emojiName: reaction._emoji.name, 
		emojiId: reaction._emoji.id, 
		channelId: reaction.message.channelId, 
		guildId: reaction.message.guildId, 
		updateTIme: getFormattedDatetime() 
	}
	sendJsonRequest(postData, 'emoji/insertemoji') 
	console.log(`${user.username} added a reaction @ ${getFormattedDatetime()}`)
});

client.on('messageReactionRemove', (reaction, user) => {
	const postData = {
		updateTIme: getFormattedDatetime(), 
		messageId: reaction.message.id,
		userId: user.id,
		emojiName: reaction._emoji.name
	}
	sendJsonRequest(postData, 'emoji/updateemoji') 
	console.log(`${user.username} removed a reaction @ ${getFormattedDatetime()}`)
});  

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);	 