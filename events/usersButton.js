module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'view_users') return;

    try {
      // Check if the user has the role with ID 38292739
      //const roleId = '860538277710790706';
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to manage users in this ticket.', ephemeral: true });
      }

      // Send an embed with two buttons to add or remove users
      const userOptionsEmbed = {
        color: 0x00ff00,
        description: 'Choose an option to manage users:',
      };

      const addUsersButton = { type:2,custom_id: 'add_users', label: 'Add Users', style: 3 };
      const removeUsersButton = { type:2,custom_id: 'remove_users', label: 'Remove Users', style: 4 };

      await interaction.reply({ embeds: [userOptionsEmbed], components: [{ type: 1, components: [addUsersButton, removeUsersButton] }] });

    } catch (error) {
      console.error('Error handling users button interaction:', error);
    }
  },
};
