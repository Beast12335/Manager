const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, MessageMentions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disruptions')
    .setDescription('Send a message in disruptions channel and ping role'),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const disruptionsChannel = interaction.client.channels.cache.get('3939922');
    const disruptionsRole = interaction.guild.roles.cache.find(role => role.name === 'disruptions');

    if (!disruptionsChannel || !disruptionsRole) {
      return interaction.followUp('Could not find the specified channel or role.');
    }

    try {
      await disruptionsChannel.send(`${disruptionsRole.toString()}, ${interaction.user.toString()} has a message for you!`);
      await disruptionsChannel.send('Here is the important message for disruptions:');

      const messageContent = 'This is an important message for disruptions.';
      await disruptionsChannel.send(messageContent);

      interaction.followUp('Message sent successfully to disruptions channel and role.');
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while sending the message.', ephemeral: true });
    }
  },
};
