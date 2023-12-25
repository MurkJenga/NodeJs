const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { deactive_message, update_message, insert_message, remove_reaction, add_reaction} = require('./custom_functions/databaseFunctions.js');
const { createdEmbed, randomReply } = require('./custom_functions/miscFunctions.js')

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

client.on('raw', packet => { 
	//console.log(`switch: ${packet.t}`)
	const { d: data } = packet;
    switch (packet.t) {
        case 'MESSAGE_DELETE':
			deactive_message(data.id, data.channel_id, data.guild_id) 
			break
        case 'MESSAGE_UPDATE':
			update_message(data.timestamp, data.id, data.content, data.channel_id, data.guild_id) //, data.author.id
			break
		case 'MESSAGE_CREATE': 
            insert_message(data.channel_id, data.guild_id, data.id, data.timestamp, data.content, data.author.id);  
            break;
		case 'MESSAGE_REACTION_REMOVE': 
			remove_reaction(data.user_id, data.message_id, data.emoji.name, data.emoji.id, data.channel_id, data.guild_id)			
            break;
		case 'MESSAGE_REACTION_ADD': 
			add_reaction(data.user_id, data.message_id, data.emoji.name, data.emoji.id, data.channel_id, data.guild_id)			
			//Object.keys(data.emoji).forEach((prop)=> console.log(prop))   
			break;
        default: 
            break; //userId, messageId, emojiName, emojiId, channelId, guildId
    }
});

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

async function fetchAllMessages(channel) {
    let allMessages = [];
    let lastMessageId;

    do {
        // Fetch messages page by page
        const messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });

        // Check if there are more messages
        if (messages.size > 0) {
            // Update lastMessageId for the next iteration
            lastMessageId = messages.last().id;

            // Concatenate the messages to the array
            allMessages = allMessages.concat(Array.from(messages.values()));
        } else {
            // No more messages, exit the loop
            break;
        }
    } while (true);
    return allMessages;
}

client.on('messageCreate', async (message) => {
    if (message.content === '!fetchAllMessages') {
        try {
            const channel = message.channel;
            const allMessages = await fetchAllMessages(channel);

            // Now allMessages contains an array of all messages in the channel
			//allMessages.forEach((element) => console.log(element.channelId, element.guildId, element.id, element.createdTimestamp, element.content, element.author.id))
			console.log(`Fetched ${allMessages.length} messages.`);
		} catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    if (message.content.toLowerCase().includes('peter') && message.content.toLowerCase().includes('mom')) {
		message.react('👋')
		message.reply({ embeds: [createdEmbed('682352', randomReply() )] } )
	}
}); 

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);	 