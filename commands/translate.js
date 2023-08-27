const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const translate = require('@vitalets/google-translate-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate given text to English')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text to translate')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const textToTranslate = interaction.options.getString('text');

    try {
      const translation = await translate(textToTranslate, { to: 'en' });

      const embed = new EmbedBuilder()
        .setTitle('Translation')
        .setDescription(translation.text)
        .setThumbnail(interaction.guild.iconURL())
        .setColor('Random')
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while translating the text.', ephemeral: true });
    }
  },
};

