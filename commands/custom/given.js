const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise'); 
const config = require('../../config.json'); 
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')

const pool = mysql.createPool(config.mysql);  

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
    join reaction r on r.user_id = u.user_id
    where  coalesce(concat("<", ":", r.emoji_txt, ":", emoji_id, ">"), r.emoji_txt) = ?
    group by u.username, r.emoji_txt, r.emoji_id
    `

module.exports = {
	data: new SlashCommandBuilder()
		.setName('given')
        .addStringOption(option =>
			option
				.setName('emoji')
                .setRequired(true)
				.setDescription('What emoji do you want to see stats for?'))
		.setDescription('Return the total emojis given for the provided emoji'),
    async execute(interaction) { 
        const emoji = interaction.options.getString('emoji')        
        const [rows, fields] = await  pool.execute(query, [emoji]);  
        
        if (rows[0]) {
            const data =  rows.map(row => row.stats).join('\n')  
            await interaction.reply({ embeds: [createdEmbed('a33600', `Total Emojis Recieved For: ${emoji}`, String(data))], ephemeral: false })

        } else {
            const embed = new EmbedBuilder()
                .setColor('a33600')
                .setTitle(`There have been no reactions for ${emoji}`)  
                await interaction.reply({ embeds: [embed], ephemeral: false }); 
        }

        
    }
}