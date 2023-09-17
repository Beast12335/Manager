const { ActionRowBuilder, ButtonBuilder, MessageCollector } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'remove_users') return;

    try {
      // Your code to remove users from the channel goes here
      // You can use MessageCollector to wait for user input for 10 seconds

      // Example:
      await interaction.reply({ content: 'Please provide the user ID you want to remove from the channel.', ephemeral: false });
      const collector = interaction.channel.createMessageCollector({ time: 10000 }); // Collect messages for 10 seconds
      collector.on('collect', async (message) => {
        collector.stop()
        // Remove the user with the provided ID from the channel
        const userIdToRemove = message.content;
        const userToRemove = await interaction.guild.members.fetch(userIdToRemove);
        if (!userToRemove) return; // User not found

        await interaction.channel.permissionOverwrites.delete(userIdToRemove);

        // Send a success message
        await interaction.channel.send(`User with ID ${userIdToRemove} has been removed from the channel.`);
      });

      collector.on('end', () => {
        console.log('users remove collector ended')
        // Collection time expired, handle as needed
      });

    } catch (error) {
      console.error('Error handling remove users button interaction:', error);
    }
  },
};
