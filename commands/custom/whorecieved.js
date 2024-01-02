const { SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const config = require('../../config.json');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')
const { getFormattedDatetime } = require('../../custom_functions/getFormattedDatetime.js')

const cstDatetime = getFormattedDatetime()

const pool = mysql.createPool(config.mysql); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whorecieved')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('to show the targeted user\'s tag')
                .setRequired(true))
        .addStringOption(option =>
			option
				.setName('emoji')
                .setRequired(true)
				.setDescription('What emoji do you want to see stats for?'))
		.setDescription('Returns list of users and the times they gave an emoji to the specified user'),

    async execute(interaction) { 
        try { 
            const emoji = interaction.options.getString('emoji')   
            const user = interaction.options.getUser('user')   
            const query = `
            select 
                concat(
                ROW_NUMBER() OVER ( ORDER BY count(m.message_id) desc ), ". ",
                author.username, ": ",
                format(count(m.message_id), 0)
                ) stats, 
                r.emoji_txt,
                author.username as author,
                count(*) as reactions
            from user u
            join reaction r on u.user_id = r.user_id
            join message m on m.message_id = r.message_id
            join user author on author.user_id = m.author_id
            where
                coalesce(concat("<", ":", r.emoji_txt, ":", emoji_id, ">"), r.emoji_txt) = '${emoji}' and
                u.user_id = ${user.id}
            group by 
                u.username,
                r.emoji_txt,
                author.username
                `
            const [rows, fields] = await  pool.execute(query);  
            console.log(`Returned ${rows.length} row(s) @ ${cstDatetime} using the /User command`);
             
            const data =  rows.map(row => row.stats).join('\n')
            //console.log(data) 
                
            await interaction.reply({ embeds: [createdEmbed('a0f79c', `Users who recieved the most ${emoji} from ${user.username}`, data)], ephemeral: false })

        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didnt work', '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
	},
};