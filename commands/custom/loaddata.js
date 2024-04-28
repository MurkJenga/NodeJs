const { SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const config = require('../../config.json');
const { createdEmbed } = require('../../custom_functions/miscFunctions.js')

const pool = mysql.createPool(config.mysql);

module.exports = {
  data: new SlashCommandBuilder()
      .setName('loaddata')
      .setDescription('Reload all messages and emojis'),
  async execute(interaction) {
      if (interaction.user.id == '553337834090659899') {

          //await interaction.deferReply();
          await interaction.reply({ embeds: [createdEmbed('FF0000', 'Loading Data', '')], ephemeral: false });

          try {
              const startRunTime = new Date();
              const startTimeMinutes = startRunTime
              try {
                  const channels = interaction.guild.channels.cache;

                  let messageList = [];
                  let reactionList = [];

                  for (const [, channel] of channels) {
                      if (channel.type === 0) {
                          let lastMessageId;

                          do { 
                              const messages = await channel.messages.fetch({
                                  limit: 100,
                                  before: lastMessageId
                              });
                              if (messages.size > 0) {
                                lastMessageId = messages.last().id
                                  for (const [, message] of messages) {

                                      //await message.fetch(true);  
                                      //if (message.author.bot) {
                                      //  continue;
                                      //}

                                      const date = new Date(message.createdTimestamp);

                                      const year = date.getFullYear();
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const hours = String(date.getHours()).padStart(2, '0');
                                      const minutes = String(date.getMinutes()).padStart(2, '0');
                                      const seconds = String(date.getSeconds()).padStart(2, '0');

                                      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                                      for (const [reactionKey, reaction] of message.reactions.cache) {
                                          const users = await reaction.users.fetch();
                                          const userIds = Array.from(users.keys());
                                          userIds.forEach(user =>
                                              reactionList.push({
                                                  messageId: message.id,
                                                  emoji: reaction.emoji.name,
                                                  id: reaction.emoji.id,
                                                  users: user,
                                                  channelId: channel.id,
                                                  guildId: interaction.guild.id,
                                                  addedTime: formattedDate
                                              }));
                                      }

                                      messageList.push({
                                          guildId: interaction.guild.id,
                                          channelId: channel.id,
                                          messageId: message.id,
                                          authorId: message.author.id,
                                          content: message.content,
                                          createdTimestamp: formattedDate,
                                      }); 
                                  }

                              } else { 
                                  break;
                              }
                          } while (true); 
                          console.log(`Completed: ${channel.name}`) 
                      }
                  }

                  const messageQuery = 'INSERT INTO message_stg (message_id, content_txt, guild_id, channel_id, created_dtm, author_id, og_content_txt) VALUES ?';
                  const messageValues = messageList.map((m) => [m.messageId, m.content, m.guildId, m.channelId, m.createdTimestamp, m.authorId, m.content]);

                  pool.query(messageQuery, [messageValues])
                      .then(([rows, fields]) => {
                          console.log('Insert successful!');
                      })
                      .catch((err) => {
                          console.error('Error inserting values:', err);
                      })

                  const reactionQuery = 'INSERT INTO reaction_stg (message_id, user_id, emoji_txt, emoji_id, channel_id, guild_id, added_dtm) VALUES ?';
                  const reactionValues = reactionList.map((r) => [r.messageId, r.users, r.emoji, r.id, r.channelId, r.guildId, r.addedTime]);

                  pool.query(reactionQuery, [reactionValues])
                      .then(([rows, fields]) => {
                          console.log('Insert successful!');
                      })
                      .catch((err) => {
                          console.error('Error inserting values:', err);
                      })

                  const endRunTime = new Date();
                  const endTimeMinutes = endRunTime

                  console.log(`${reactionList.length} reactions retrieved`)
                  console.log(`${messageList.length} messages retrieved`)

                  const loadTime = ((endTimeMinutes - startTimeMinutes) / 1000) / 60

                  //await interaction.followUp({
                   //   embeds: [createdEmbed('5beb34', `Emojis and Messages are up to date now`, `The load time took ${loadTime.toFixed(2)} minutes`)],
                    //  ephemeral: false
                 // })
                 console.log(loadTime)

              } catch (error) {
                  console.error('Error fetching data:', error);
              }
          } catch (error) {
              console.error('Error iterating through channels:', error);
              await interaction.reply({
                  embeds: [createdEmbed('FF0000', `There was an error with the load command`)],
                  ephemeral: false
              });
          }
      } else {
          await interaction.reply({
              embeds: [createdEmbed('FF0000', `You are not allowed to use this command`)],
              ephemeral: false
          });
      }
  },
};