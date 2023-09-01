const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const qr = require('qrcode');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createbot')
    .setDescription('Create a bot')
    .addUserOption(option =>
      option.setName('customer')
        .setDescription('Select the customer')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const customer = interaction.options.getUser('customer');
    try {
      
      await interaction.followUp({ content: 'Starting the bot creating process. Let\'s continue in DMs.', ephemeral: true });
      const ch = interaction.client.channels.cache.get('1047679692632768512')
      const customerRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Continue')
          .setStyle('Success')
          .setCustomId('start'),
        new ButtonBuilder()
        .setLabel('Cancel')
        .setStyle('Danger')
        .setCustomId('cancel_bot')
      );
      const embed = new EmbedBuilder()
      .setTitle('Bot Creation Process')
      .setColor('Random')
      .setDescription(' ')
      .addFields({
        name:`**Order Channel:**`,value:interaction.channel.id,inline:true},
        {name:`**Customer:**`,value: customer.id,inline:true},);
      await ch.send({content:`<@${interaction.user.id}>`,embeds:[embed], components:[customerRow]})
      
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred during the bot creating process.', ephemeral: true });
    }
  },
};
