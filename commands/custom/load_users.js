const { SlashCommandBuilder } = require('discord.js');

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
            description: 'Refreshing user data'
        }
        try {
            // Check if the user has the necessary permissions (optional)
            if (interaction.user.id != '553337834090659899') {
                await interaction.reply({ embeds: [embed_denied], ephemeral: false });
            }
 
            const userInfo = []; 
            // Get all members in the guild
            const members = await interaction.guild.members.fetch();

            // Iterate through each member
            members.forEach(member => {
                // Extract user information
                const joineddate = new Date(member.joinedTimestamp) 
                const info = {
                    userId: member.user.id,
                    username: member.user.username,
                    joinDate: joineddate,
                    nickname: member.nickname,
                    isBot:  member.user.bot,
                };

                // Push the user information to the array
                userInfo.push(info);
            }); 

            //console.log(userInfo);
            userInfo.forEach(user => {
                console.log(user.userId, user.username, user.joinDate, user.nickname, user.isBot)
            })


            await interaction.reply({ embeds: [embed_granted], ephemeral: false });

        } catch (error) {
            console.error('Error listing channels:', error);
            await interaction.reply('An error occurred while listing channels.');
        }
    },
};
