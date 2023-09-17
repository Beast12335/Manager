const { ActionRowBuilder, ButtonBuilder, MessageCollector, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'add_users') return;

    try {
      // Your code to add users to the channel goes here
      // You can use MessageCollector to wait for user input for 10 seconds

      // Example:
      await interaction.reply({ content: 'Please provide the user ID you want to add to the channel.', ephemeral: false });
      const collector = interaction.channel.createMessageCollector( { time: 60000 }); // Collect messages for 10 seconds
      collector.on('collect', async (message) => {
        // Add the user with the provided ID to the channel
        const userIdToAdd = message.content;
        const userToAdd = await interaction.guild.members.fetch(userIdToAdd);
        if (!userToAdd) return; // User not found

        await interaction.channel.permissionOverwrites.create(userToAdd, { ViewChannel: true });

        // Send a success message
        collector.stop()
        await interaction.channel.send(`User with ID ${userIdToAdd} has been added to the channel.`);
        //collector.stop()
      });

      collector.on('end', collected => {
        console.log('collector for add users finished')
        //console.log(collected)
        // Collection time expired, handle as needed
      });

    } catch (error) {
      console.error('Error handling add users button interaction:', error);
    }
  },
}
