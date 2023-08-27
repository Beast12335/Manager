const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send a message as an embed')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message to send in an embed')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ephemeral:true})
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.MANAGE_GUILD) || !userPermissions.has(PermissionsBitField.Flagd.ADMINISTRATOR)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const messageContent = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setDescription(messageContent)
      .setColor('Random') // Yellowish color
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });

    try {
      await interaction.followUp({content:`Embed sent`, ephemeral:true})
      await interaction.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while sending the embed.', ephemeral: true });
    }
  },
};
