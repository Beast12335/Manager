module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'assign_role') return;

    try {
      // Check if the user has the role with ID 38292739
      //const roleId = '860538277710790706';
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to manage roles in this ticket.', ephemeral: true });
      }

      // Send an embed with two buttons to add or remove roles
      const roleOptionsEmbed = {
        color: 0x00ff00,
        description: 'Choose an option to manage roles:',
      };

      const addRolesButton = { type:2,custom_id: 'add_roles', label: 'Add Roles', style: 3 };
      const removeRolesButton = { type:2,custom_id: 'remove_roles', label: 'Remove Roles', style: 4 };

      await interaction.reply({ embeds: [roleOptionsEmbed], components: [{ type: 1, components: [addRolesButton, removeRolesButton] }] });

    } catch (error) {
      console.error('Error handling role button interaction:', error);
    }
  },
};
