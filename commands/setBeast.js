const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setbeast')
    .setDescription('Add an urgent flag to a ticket channel and ping Mr. Beast'),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.MANAGE_NICKNAMES) || !userPermissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.channel;

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);

      const [rows] = await connection.execute('SELECT channel, status FROM tickets WHERE channel = ?', [channel.id]);

      if (rows.length === 0) {
        await connection.end();
        return interaction.followUp('This is not a valid ticket channel.');
      }

      const channelStatus = rows[0].status;
      if (channelStatus !== 'open') {
        await connection.end();
        return interaction.followUp('This ticket channel is not open.');
      }

      await connection.end();

      await channel.setName(`💥 ${channel.name} `);

      const mrBeastUser = await interaction.client.users.fetch('2828282');
      if (mrBeastUser) {
        await interaction.followUp({
          content: `Mr. Beast, you are urgently needed in ${channel}!`,
          allowedMentions: { users: [mrBeastUser.id] },
        });
      } else {
        return interaction.followUp('Could not find Mr. Beast user.');
      }

      const embed = new EmbedBuilder()
        .setTitle('Urgent Flag Set')
        .setDescription(`An urgent flag has been added to ${channel.name} and Mr. Beast has been notified.`)
        .setColor('Random') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while setting the urgent flag and notifying Mr. Beast.', ephemeral: true });
    }
  },
};

