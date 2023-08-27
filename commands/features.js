const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('features')
    .setDescription('Shows  features of a bot')
    .addStringOption(option =>
      option.setName('bot')
        .setDescription('Select a bot type')
        .addChoice('Modmail', 'modmail')
        .addChoice('Clan Bot', 'clan_bot')
        .addChoice('Ticket', 'ticket')
        .addChoice('Music', 'music')
        .addChoice('Custom', 'custom')),
  async execute(interaction) {
    await interaction.deferReply()
    const selectedFeature = interaction.options.getString('bot');

    const embed = new EmbedBuilder()
      .setTitle(`Features of ${selectedFeature}`)
      .setDescription(`You chose ${selectedFeature}`)
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
