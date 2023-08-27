const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a message')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message to send')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.MANAGE_GUILD) ||  !userPermissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const messageContent = interaction.options.getString('message');

    try {
      await interaction.followUp({content:`Message sent`, ephemeral:true})
      await interaction.channel.send(messageContent);
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while sending the message.', ephemeral: true });
    }
  },
};

