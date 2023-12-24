const { SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const { hostname, user, password, database } = require('../../config.json');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')
const { getFormattedDatetime } = require('../../custom_functions/getFormattedDatetime.js')

const cstDatetime = getFormattedDatetime()

const pool = mysql.createPool({
    host: hostname,
    user: user,
    password: password,
    database: database,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 5
});  

const query = `
    select concat(
        ROW_NUMBER() OVER ( ORDER BY count(m.message_id) desc ), ". ",
        u.username, ": ",
        count(m.message_id) 
        ) stats
    from user u 
    left join message m on m.author_id = u.user_id
    where u.isBot = 0
    group by u.username
    order by 1 asc
    `

module.exports = {
	data: new SlashCommandBuilder()
		.setName('total')
		.setDescription('Returns total messages per user'),

    async execute(interaction) { 
        try { 
            const [rows, fields] = await  pool.execute(query);  
            console.log(`Returned ${rows.length} row(s) @ ${cstDatetime} using the /User command`);
             
            const data =  rows.map(row => row.stats).join('\n')
            console.log(data) 
                
            await interaction.reply({ embeds: [createdEmbed('8c03fc', `Total Messages per User`, data)], ephemeral: false })

        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didnt work', '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
	},
};