const { ActionRowBuilder, ButtonBuilder, MessageCollector } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'remove_roles') return;

    try {
      // Your code to remove roles from the channel goes here
      // You can use MessageCollector to wait for user input for 10 seconds

      // Example:
      await interaction.reply({ content: 'Please provide the role ID you want to remove from the channel.', ephemeral: false });
      const collector = interaction.channel.createMessageCollector({ time: 10000 }); // Collect messages for 10 seconds
      collector.on('collect', async (message) => {
        collector.stop()
        // Remove the role with the provided ID from the channel
        const roleIdToRemove = message.content;
        const roleToRemove = interaction.guild.roles.cache.get(roleIdToRemove);
        if (!roleToRemove) return; // Role not found

        await interaction.channel.permissionOverwrites.delete(roleIdToRemove);

        // Send a success message
        await interaction.channel.send(`Role with ID ${roleIdToRemove} has been removed from the channel.`);
      });

      collector.on('end', () => {
         console.log('role removing collector ended')
        // Collection time expired, handle as needed
      });

    } catch (error) {
      console.error('Error handling remove roles button interaction:', error);
    }
  },
};
