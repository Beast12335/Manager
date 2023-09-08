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
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'order') return;
    await interaction.deferReply({ephemeral:true}});
    try {
      
    } catch (e) {
      console.log('Error handling  order interaction:', e);
      await interaction.followUp({content:`Error: ${e}`, ephemeral:true});
    }
  },
}
