const transcript = require('discord-html-transcripts');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'get_transcript') return;

    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to generate the transcript.', ephemeral: true });
      }

      const attachment = await transcript.createTranscript(interaction.channel)
      // Execute the transcript function for the ticket channel
      //
      interaction.channel.send({
        files:[attachment],
      });
    } catch (error) {
      console.error('Error handling transcript button interaction:', error);
    }
  },
};
