const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('howtoorder')
    .setDescription('Get instructions on how to order'),
  async execute(interaction) {
    await interaction.deferReply()
    const embed = new EmbedBuilder()
      .setTitle(interaction.user.username)
      .setDescription('Success')
      .setColor('Random') // Yellowish color
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });

    try {
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while sending the response.', ephemeral: true });
    }
  },
};
