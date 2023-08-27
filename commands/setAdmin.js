const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setadmin')
    .setDescription('Remove all roles from a ticket channel'),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.channel;

    try {
      await channel.permissionOverwrites.edit(interaction.guild.id, { VIEW_CHANNEL: false });

      const embed = new EmbedBuilder()
        .setTitle('Admin-Only')
        .setDescription(`Removed all roles from ${channel.name}. Only admins can access this channel now.`)
        .setColor('Random') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while removing roles from the channel.', ephemeral: true });
    }
  },
};

