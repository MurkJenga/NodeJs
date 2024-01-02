const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const config = require('../../config.json');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')
const { getFormattedDatetime } = require('../../custom_functions/getFormattedDatetime.js')
 
const cstDatetime = getFormattedDatetime()

const pool = mysql.createPool(config.mysql);  


const query = `
with last30Messages as (
	select * from message where datediff(current_date, created_dtm)  <  31),
	totalMessages as (
        select count(*) totalMsgs, u.user_id
        from user u
        join last30Messages m on m.author_id = u.user_id
        group by u.user_id),
	last30Reactions as (
	select * from reaction where datediff(current_date, added_dtm)  <  31),
    avgWordsMsg as (
        select 
            sum((length(m.content_txt) - length(replace(m.content_txt,' ',''))) + 1) /count(m.message_id) as averageWrds,
            u.user_id
        from user u
        join last30Messages m on m.author_id = u.user_id
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
        join last30Messages m on m.author_id = u.user_id
        group by u.user_id	 
        ),
    avgPerDay as (
        select 
            count(m.message_id) / 30 as avgPerDay,
            u.user_id
        from user u
        join last30Messages m on m.author_id = u.user_id
        group by u.user_id	 
        ),
    reactionGiven as (
        select 
            u.user_id,
            count(*) as reactGiv
        from user u 
        join last30Reactions r on r.user_id = u.user_id and is_active = 1
        group by 1
        ),
    reactionRec as (
        select 
            count(emoji_txt) reactRec,
            u.user_id
        from user u
        join last30Messages m on m.author_id = u.user_id
        join last30Reactions r on r.message_id = m.message_id and r.user_id != m.author_id
        group by 2
        ),
    topReact as (
		select 
            u.user_id,
            (coalesce(concat("<", ":", r.emoji_txt, ":", emoji_id, ">"), r.emoji_txt) ) as topReact,
            count(*),
            ROW_NUMBER() OVER ( partition by u.user_id ORDER BY count(*) desc ) rowno
        from user u
        join last30Reactions r on r.user_id = u.user_id 
        group by 1, 2
        )
        
    select 
        u.user_id,
        username,
        coalesce(DATE_FORMAT(join_dtm, "%m-%d-%Y"), 'N/A'  ) joinDate,
        coalesce(totMsgs.totalMsgs, 0) totalMsgs,
        round(coalesce(averageWrds, 0),0) averageWrds,
        coalesce(DATE_FORMAT(lastMsg.lastMsg, "%m-%d-%Y"), 'N/A') lastMsg,
        coalesce(totWrds.totalWrds, 0) totalWrds,
        round(coalesce(perDay.avgPerDay, 0),0) avgPerDay,
        coalesce(rGiv.reactGiv, 0) reactGiv,
        coalesce(reactRec, 0) reactRec,
        coalesce(tReact.topReact, 'N/A') as topReact
    from user u
    left join totalMessages totMsgs on totMsgs.user_id = u.user_id
    left join avgWordsMsg averg on averg.user_id = u.user_id
    left join lastMessage lastMsg on lastMsg.user_id = u.user_id
    left join totalWrds totWrds on totWrds.user_id = u.user_id
    left join avgPerDay perDay on perDay.user_id = u.user_id
    left join reactionGiven rGiv on rGiv.user_id = u.user_id 
    left join reactionRec rRec on rRec.user_id = u.user_id
    left join topReact tReact on tReact.user_id = u.user_id AND rowno = 1
    where 
        u.user_id = ?
    `

        
module.exports = {
	data: new SlashCommandBuilder()
		.setName('last30')
		.setDescription('Returns user stats based on user passed from the last 30 days')
        .addUserOption(option => option.setName('user').setDescription('to show the targeted user\'s tag').setRequired(true)),
    async execute(interaction) { 
        try { 
            const user = interaction.options.getUser('user')  
            const [rows, fields] = await  pool.execute(query, [user.id]);  
            console.log(`Returned ${rows.length} row(s) @ ${cstDatetime} using the /User command`);
            
            const userStats = rows[0]; // Access the first row  
            const embed = new EmbedBuilder()
                .setColor('6e34eb')
                .setTitle(`${userStats.username}'s stats`)  
                .setDescription('The stats for the last 30 days') 
                .addFields(
                    { name: 'Join Date', value: userStats.joinDate, inline: true}, 
                    { name: 'Total Messages', value: String(userStats.totalMsgs), inline: true },
                    { name: 'Avg Words Per Message', value: userStats.averageWrds, inline: true },
                    { name: 'Last Message Sent', value: userStats.lastMsg, inline: true },
                    { name: 'Total Words', value: userStats.totalWrds, inline: true },
                    { name: 'Average Messages Per Day', value: userStats.avgPerDay, inline: true },
                    { name: 'Emojis Given', value: String(userStats.reactGiv), inline: true },
                    { name: 'Emojis Recieved', value: String(userStats.reactRec), inline: true },
                    { name: 'Top Emoji Used', value: userStats.topReact, inline: true },
                ) 
                
            await interaction.reply({ embeds: [embed], ephemeral: false });

        } catch (error) {
            await interaction.reply({ embeds: [createdEmbed('FF0000', 'This didnt work', '')], ephemeral: false });
            console.error('Error reading data from MySQL:', error) 
        } 
	},
};