const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,StringSelectMenuBuilder
} = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  name:'interactionCreate',
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'bot_type') return;
    await interaction.deferUpdate();
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
      const type = interaction.values[0]
      const embed = interaction.message.embeds[0]
      const newEmbed = EmbedBuilder.from(embed).addFields({name:`**Bot Creator:**`,value: interaction.user.id,inline:true},{name:`**Bot Type:**`,value:type,inline:true})
      const menu = new StringSelectMenuBuilder()
      .setPlaceholder('Choose the payment type')
      .setCustomId('payment')
      .addOptions({
        label:`Invites`,value:`invites`},{
        label:`Money`,value:`money`},{
        label:`Event`,value:`event`});
      const row = new ActionRowBuilder()
      .addComponents(menu)
      await interaction.editReply({embeds:[newEmbed], components:[row]});
    } catch (e) {
      console.log('Error handling  bot creation type menu:', e);
      await interaction.followUp({content:`Error: ${e}`});
    }
  },
};
