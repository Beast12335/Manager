const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('features')
    .setDescription('Shows  features of a bot')
    .addStringOption(option =>
      option.setName('bot')
        .setDescription('Select a bot type')
        .addChoices({name:'Modmail', value:'modmail'},
                    {name:'Clan Bot', value:'clan_bot'},
                   {name:'Ticket', value:'ticket'},
                   {name:'Music', value:'music'},
                   {name:'Custom', value:'custom'})),
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
