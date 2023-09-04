const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder, MessageCollector,
  EmbedBuilder,StringSelectMenuBuilder
} = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  name:'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'edit') return;
    await interaction.deferReply({ephemeral:true});
    try {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.followUp({
          content: "You don't have permission to interact with this button.",
          ephemeral: true,
        });
      }
      await interaction.followUp({content:`Still under development`, ephemeral:true})
    } catch (e) {
      console.log('Error handling  edit button:', e);
      await interaction.followUp({content:`Error: ${e}`, ephemeral:true});
    }
  },
}
