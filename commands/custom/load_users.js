const { SlashCommandBuilder } = require('discord.js');
const { insert_user } = require('../../custom_functions/databaseFunctions')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshusers')
        .setDescription('Refreshes user data'),
    async execute(interaction) {
        const embed_denied = {
            color: parseInt('FF0000', 16),
            title: 'Status:',
            description: 'Access Denied'
        }
        const embed_granted = {
            color: parseInt('00FF00', 16),
            title: 'Status:',
            description: 'Refreshed user data'
        }
        try {
            if (interaction.user.id != '553337834090659899') {
                await interaction.reply({ embeds: [embed_denied], ephemeral: false });
            } else {
 
            const userInfo = []; 
            const members = await interaction.guild.members.fetch();

            members.forEach(member => {
                const joineddate = new Date(member.joinedTimestamp) 
                const info = {
                    userId: member.user.id,
                    username: member.user.username,
                    joinDate: joineddate,
                    nickname: member.nickname,
                    isBot: member.user.bot,
                };

                userInfo.push(info);
            }); 

            userInfo.forEach(user => {
                console.log(user.userId, user.username, user.joinDate, user.nickname, user.isBot)
                insert_user(user.userId, user.username, user.joinDate, user.nickname, user.isBot)
            })


            await interaction.reply({ embeds: [embed_granted], ephemeral: false });
        }
        } catch (error) {
            console.error('Error listing channels:', error);
            await interaction.reply('An error occurred while listing channels.');
        }
    },
};
