const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise'); 
const config = require('../../config.json'); 
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')

const pool = mysql.createPool(config.mysql);  

const query = 
    `select  
        count(r.emoji_txt) as totalReactions,
        u.user_id,
        u.username,
        m.content_txt,  
        concat('https://discord.com/channels/', m.guild_id, '/', m.channel_id, '/', m.message_id) as link
    from message m
    join reaction r on r.message_id = m.message_id
    join user u on u.user_id = m.author_id
    where u.user_id = ?
    group by 2,3,4,5
    order by 1 desc 
    limit 1
    `

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topmessage')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('to show the targeted user\'s tag')
                .setRequired(true)) 
		.setDescription('Return the message that has the most reactions on it for a user'),
    async execute(interaction) { 
        const user = interaction.options.getUser('user')  
        const [rows, fields] = await  pool.execute(query, [user.id]);  
        const data = rows[0]
        
        try {
            if (data.totalReactions > 0){
            await interaction.reply({ embeds: [createdEmbed('ae00ff', `Top Reacted Message For ${user.username}`, `${data.totalReactions} emojis: ${data.link}`)], ephemeral: false })
        } else {
            await interaction.reply({ embeds: [createdEmbed('FF0000', `${user.username} has no message above 0 `)], ephemeral: false })
        }
        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', `${user.username} has no message above 0`, '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
     
           // await interaction.reply({ embeds: [createdEmbed('ff0000', `This did not work`)], ephemeral: false })
        

        
    }
}