const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise'); 
const { hostname, user, password, database } = require('../../config.json'); 
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')

const pool = mysql.createPool({
    host: hostname,
    user: user,
    password: password,
    database: database,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 5
});  

const query = 
    `select 
    concat(
        ROW_NUMBER() OVER ( ORDER BY count(u.username) desc ), ". ",
        u.username, ": ",
        count(*) 
        ) stats,
    u.username,
    r.emoji_txt,
    r.emoji_id,
    coalesce(concat("<", ":", r.emoji_txt, ":", emoji_id, ">"), r.emoji_txt) emoji_identifier,
    count(*) recieved
    from user u
    join message m on u.user_id = m.author_id
    join reaction r on r.message_id = m.message_id
    where  coalesce(concat("<", ":", r.emoji_txt, ":", emoji_id, ">"), r.emoji_txt) = ?
    group by u.username, r.emoji_txt, r.emoji_id
    `

module.exports = {
	data: new SlashCommandBuilder()
		.setName('recieved')
        .addStringOption(option =>
			option
				.setName('emoji')
                .setRequired(true)
				.setDescription('What emoji do you want to see stats for?'))
		.setDescription('Return the total emojis recieved for the provided emoji'),
    async execute(interaction) { 
        const emoji = interaction.options.getString('emoji')        
        const [rows, fields] = await  pool.execute(query, [emoji]);  
        
        if (rows[0]) {
            const data =  rows.map(row => row.stats).join('\n') 

            const embed = new EmbedBuilder()
                .setColor('00a398')
                .setTitle(`Total Emojis Recieved For: ${emoji}`)   
                .setDescription(String(data))  
            await interaction.reply({ embeds: [createdEmbed('00a398', `Total Emojis Recieved For: ${emoji}`, String(data))], ephemeral: false })

        } else {
            const embed = new EmbedBuilder()
                .setColor('1800a3')
                .setTitle(`There have been no reactions for ${emoji}`)  
                await interaction.reply({ embeds: [embed], ephemeral: false }); 
        }

        
    }
}