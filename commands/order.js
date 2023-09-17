const {SlashCommandBuilder} = require('@discordjs/builders');
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder, ButtonBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('order')
    .setDescription('Create an order ticket (admins only)')
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Enter the order description')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('menuoptions')
        .setDescription('Enter select menu options separated by commas')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      // Check if the user is an administrator
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return interaction.followUp(
          'You do not have permission to use this command.'
        );
      }

      const description = interaction.options.getString('description');
      const menuOptions = interaction.options
        .getString('menuoptions')
        .split(',');

      // Create select menu options
      const selectMenuOptions = [];
      for (const option of menuOptions) {
        selectMenuOptions.push({
          label: option.trim(),
          value: option.trim(),
        });
      }

      // Create the select menu
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('order')
        .setPlaceholder('Choose the Bot Type')
        .addOptions(selectMenuOptions);
     const prices = new ButtonBuilder()
     .setStyle('Secondary')
     .setLabel('Prices')
     .setcustomId('prices')
     .setEmoji('💰')
     
     const payment = new ButtonBuilder()
     .setStyle('Secondary')
     .setLabel('Payment Types')
     .setcustomId('payment')
     .setEmoji('🏦')
      // Create the embed
      const embed = new EmbedBuilder()
        .setTitle('Order Ticket')
        .setDescription(description)
        .setThumbnail(interaction.guild.iconURL()) // Replace with your image URL
        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      // Send the embed with the select menu
      const row = new ActionRowBuilder().addComponents(selectMenu);
      const row1 = new ActionRowBuilder().addComponents(prices)
      const row2 = new ActionRowBuilder().addComponents(payment);
      await interaction.channel.send({embeds: [embed], components: [row1,row2,row]});
      await interaction.followUp('Order ticket setup');
    } catch (error) {
      console.error(error);
      await interaction.followUp('An error occurred');
    }
  },
};
