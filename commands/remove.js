const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a user from a channel')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to remove')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.MANAGE_NICKNAMES) || !userPermissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const channel = interaction.channel.id

    try {
      await channel.permissionOverwrites.delete(user);

      const embed = new EmbedBuilder()
        .setTitle('User Removed')
        .setDescription(`Removed ${user.tag} from <#${channel}>`)
        .setColor('Random') // Yellowish color
        .setThumbnail(user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while removing the user from the channel.', ephemeral: true });
    }
  },
};
