module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'claim_ticket') return;

    try {
      // Check if the user has the role with ID 38292739
      //const roleId = '914051151169716245';
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to claim this ticket.', ephemeral: true });
      }

      // Send an embed saying the ticket has been claimed by the user
      const claimEmbed = {
        color: 0xff9900,
        description: `Ticket has been claimed by ${interaction.user.username}.`,
      };

      await interaction.reply({ embeds: [claimEmbed], ephemeral: false });

    } catch (error) {
      console.error('Error handling claim button interaction:', error);
    }
  },
};
