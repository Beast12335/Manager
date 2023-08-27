const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close a ticket channel'),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.MANAGE_NICKNAMES)) {
      return interaction.reply({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.channel;

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);

      const [rows] = await connection.execute('SELECT user FROM tickets WHERE channel = ?', [channel.id]);

      if (rows.length === 0) {
        connection.end();
        return interaction.reply('This is not a valid ticket channel.');
      }

      const userId = rows[0].user;

      await connection.execute('UPDATE tickets SET status = ? WHERE channel = ?', ['closed', channel.id]);

      await channel.permissionOverwrites.edit(userId, {
        VIEW_CHANNEL: false,
      });

      await connection.end();

      const embed = new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setDescription(`Ticket channel has been closed and permissions for ${interaction.guild.members.cache.get(userId).user.tag} have been removed.`)
        .setColor('Random') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while closing the ticket channel.', ephemeral: true });
    }
  },
};

