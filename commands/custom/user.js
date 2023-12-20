const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const { hostname, user, password, database } = require('../../config.json');
const { executeQuery } = require('../../custom_functions/executeQuery.js')
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
query = `
    with totalMessages as (
        select count(*) totalMsgs, u.user_id
        from user u
        join message m on m.author_id = u.user_id
        group by u.user_id),
    avgWordsMsg as (
        select 
            sum((length(m.content_txt) - length(replace(m.content_txt,' ',''))) + 1) /count(m.message_id) as averageWrds,
            u.user_id
        from user u
        join message m on m.author_id = u.user_id
        group by u.user_id	
        ),
    lastMessage as (
        select 
            max(date(m.created_dtm)) as lastMsg,
            u.user_id
        from user u
        join message m on m.author_id = u.user_id
        group by 2
        ),
    totalWrds as ( 
        select 
            sum((length(m.content_txt) - length(replace(m.content_txt,' ',''))) + 1) totalWrds,
            u.user_id
        from user u
        join message m on m.author_id = u.user_id
        group by u.user_id	 
        ),
    avgPerDay as (
        select 
            count(m.message_id) / datediff(current_date(), date(u.join_dtm)) as avgPerDay,
            u.user_id
        from user u
        join message m on m.author_id = u.user_id
        group by u.user_id	 
        ),
    reactionGiven as (
        select 
            u.user_id,
            count(*) as reactGiv
        from user u 
        join reaction r on r.user_id = u.user_id and is_active = 1
        group by 1
        ),
    reactionRec as (
        select 
            count(emoji_txt) reactRec,
            u.user_id
        from user u
        join message m on m.author_id = u.user_id
        join reaction r on r.message_id = m.message_id and r.user_id != m.author_id
        group by 2
        ),
    topReact as (
        select 
            u.user_id,
            max(r.emoji_txt) as topReact
        from user u
        join reaction r on r.user_id = u.user_id
        group by 1
        )
        
    select 
        u.user_id,
        username,
        date(join_dtm) joinDate,
        coalesce(totMsgs.totalMsgs, 0) totalMsgs,
        round(coalesce(averageWrds, 0),0) averageWrds,
        coalesce(lastMsg.lastMsg, 'N/A') lastMsg,
        coalesce(totWrds.totalWrds, 0) totalWrds,
        round(coalesce(perDay.avgPerDay, 0),0) avgPerDay,
        coalesce(rGiv.reactGiv, 0) reactGiv,
        coalesce(reactRec, 0) reactRec,
        tReact.topReact
    from user u
    left join totalMessages totMsgs on totMsgs.user_id = u.user_id
    left join avgWordsMsg averg on averg.user_id = u.user_id
    left join lastMessage lastMsg on lastMsg.user_id = u.user_id
    left join totalWrds totWrds on totWrds.user_id = u.user_id
    left join avgPerDay perDay on perDay.user_id = u.user_id
    left join reactionGiven rGiv on rGiv.user_id = u.user_id 
    left join reactionRec rRec on rRec.user_id = u.user_id
    left join topReact tReact on tReact.user_id = u.user_id
    where 
        u.user_id = ?
    `

        
module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Returns user stats based on user passed')
        .addUserOption(option => option.setName('target').setDescription('to show the targeted user\'s tag')),

    async execute(interaction) { 
        try { 
            const user = interaction.options.getUser('target')  
            const [rows, fields] = await  pool.execute(query, [user.id]);  
            console.log(`Returned ${rows.length} row(s) @ ${cstDatetime} using the /User command`);
            
            const userStats = rows[0]; // Access the first row 
            console.log(userStats)

            const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(user.username) 
                    .setDescription('King Jenga')
                    .setThumbnail('https://i.imgur.com/AfFp7pu.png') 
                    .setImage('https://i.imgur.com/AfFp7pu.png')
                    .addFields(
                        { name: 'Total Words', value: user.totalWrds },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Inline field title', value: 'Some value here', inline: true },
                        { name: 'Inline field title', value: 'Some value here', inline: true },
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
            await interaction.reply({ embeds: [exampleEmbed], ephemeral: false });

        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didnt work', '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
	},
};