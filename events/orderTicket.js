 const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  MessageCollector,
  EmbedBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'order') return;
    await interaction.deferReply({ephemeral: true});
    try {
      const user = interaction.user;
      const chosenValue = interaction.values[0];
      const guild = interaction.guild;
      const channelName = `🏷️ ${chosenValue} ${user.username}`;
      const channelDescription = `${chosenValue} (Created at: ${new Date().toLocaleString()})`;
      const connection = await mysql.createConnection(process.env.DB_URL);

      const newChannel = await guild.channels.create(channelName, {
        type: 0,
        topic: channelDescription,
        permissionOverwrites: [
          {
            id: user.id,
            allow: ['PermissionsBitField.ViewChannel'],
          },
          {
            id: '1105054387488952340', // Role ID 39393939
            allow: ['PermissionsBitField.ViewChannel'],
          },
          {
            id: guild.id,
            deny: ['PermissionsBitField.ViewChannel'],
          },
        ],
      });

      const logChannelId = '1149237945245646890'; // Log channel ID
      const logChannel = await guild.channels.cache.get(logChannelId);
      if (logChannel) {
        await logChannel.send(
          `${user.username} made a ticket to order **${chosenValue}**`
        );
      }

      const embed = {
        title: `${user.tag}`,
        thumbnail: {
          url: guild.iconURL(),
        },
        footer: {
          icon_url: guild.iconURL(),
          text: guild.name,
        },
        description: `${user.tag} Thank you for ordering a ${chosenValue}. \n Kindly tell us the following information else we can't create the ${chosenValue}for you.`,
        fields: [
          {
            name: '> 1. What should be the **Bot Name**?',
            value: ' ',
            name:'> 2. What should be the **Bot Logo**?',
            value:' ',
            name:'> 3. What should be the **Activity Type**?',
            value:' `(Playing/Watching/Streaming/,Competing)`',
            name:'> 4. What should be the **Status**?',
            value:' `(Ex. -help)`',
            name:'> 5. What is the **Payment Method**',
            value:' ',
            name:'Use `/howtopay` on more details about payment methods',
            value:' '
          },
        ],
      };
      
      const claim = new ButtonBuilder()
      .setStyle('Secondary')
      .setLabel('Claim')
      .setCustomId('claim')
      const users = new ButtonBuilder()
      .setStyle('Primary')
      .setLabel('Users')
      .setCustomId('users')
      const role = new ButtonBuilder()
      .setStyle('Primary')
      .setLabel('Roles')
      .setCustomId('roles')
      const close = new ButtonBuilder()
      .setStyle('Danger')
      .setLabel('Close')
      .setCustomId('close')
      const deleteButton = new ButtonBuilder()
      .setStyle('Danger')
      .setLabel('Delete')
      .setCustomId('delete')
      const transcript = new ButtonBuilder()
      .setStyle('Secondary')
      .setLabel('Transcript')
      .setCustomId('transcript')
      
      const row = new ActionRowBuilder()
      .addComponents(claim,users,role,close)
      const row2 = new ActionRowBuilder()
      .addComponents(deleteButton,transcript)

      const message = await newChannel.send({content:`<@${user.id}>, <@&1105054387488952340>`,embeds: [embed], components:[row,row2]});
      await message.pin();
      await interaction.followUp(`Ticket created. <#newChannel.id>`)
      await connection.execute('insert into tickets values (?,?,?,?)',[user.id,newChannel.id,guild.id,'open'])
    } catch (e) {
      console.log('Error handling  order interaction:', e);
      await interaction.followUp({content: `Error: ${e}`, ephemeral: true});
    }
  },
};
