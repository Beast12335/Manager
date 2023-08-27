const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setimportant')
    .setDescription('Move an open ticket channel to the top of the category'),
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

      const category = channel.parent;
      if (category) {
        await channel.setPosition(0, { parent: category });

        await channel.setName(`🏁 ${channel.name}`);

        const embed = new EmbedBuilder()
          .setTitle('Channel Set as Important')
          .setDescription(`Ticket channel ${channel} has been moved to the top of the category and flagged as important.`)
          .setColor('Random') // Yellowish color
          .setThumbnail(interaction.user.displayAvatarURL())
          .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
          });

        await interaction.followUp({ embeds: [embed] });
      } else {
        return interaction.followUp('The channel is not in any category.');
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while setting the channel as important.', ephemeral: true });
    }
  },
};

