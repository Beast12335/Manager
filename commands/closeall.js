const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('closeall')
    .setDescription('Close all open ticket channels'),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.MANAGE_NICKNAMES) || !userPermissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);

      const [rows] = await connection.execute('SELECT channel, user FROM tickets WHERE status = ?', ['open']);

      if (rows.length === 0) {
        await connection.end();
        return interaction.followUp('No open ticket channels found.');
      }

      const embeds = [];
      for (const row of rows) {
        const channel = interaction.guild.channels.cache.get(row.channel_id);
        if (channel) {
          const userId = row.user;
          await connection.execute('UPDATE tickets SET status = ? WHERE channel = ?', ['closed',channel.id]);
          await channel.permissionOverwrites.edit(userId, { VIEW_CHANNEL: false });

          const embed = new EmbedBuilder()
            .setTitle('Ticket Closed')
            .setDescription(`Ticket channel ${channel} has been closed and permissions for ${interaction.guild.members.cache.get(userId).user.tag} have been removed.`)
            .setColor('Random') // Yellowish color
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL(),
            });

          embeds.push(embed);
        }
      }

      await connection.end();

      await interaction.followUp({ embeds });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while closing the ticket channels.', ephemeral: true });
    }
  },
};
