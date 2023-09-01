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
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'start') return;
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

      const embed = interaction.message.embeds[0];
      const menu = new StringSelectMenuBuilder()
      .setCustomId('bot_type')
      .setPlaceholder('Choose the Bot Type')
      .addOptions({
        value:`All in One`,
        description:` `,
        label:`All in One`},{
        value:`Music Bot`,
        description:` `,
        label:`Mysic Bot`},{
        value:`Modmail Bot`,
        description:` `,
        label:`Modmail Bot`},{
        value:`Ticket Bot`,
        description:` `,
        label:`Ticket Bot`},{
        value:`Channel Bot`,
        description:` `,
        label:`Channel Bot`},{
        value:`Security Bot`,
        description:` `,
        label:`Security Bot`},{
        value:`WaitingRoom Bot`,
        description:` `,
        label:`WaitingRoom Bot`},{
        value:`Custom Bot`,
        description:` `,
        label:`Custom Bot`});
      const button = new ButtonBuilder()
      .setCustomId('cancel_bot')
      .setStyle('Danger')
      .setLabel('Cancel');
      
      const row = new ActionRowBuilder()
      .addComponents(menu,button)
      await interaction.updateReply({embeds:[embed], components:[row]})
    } catch (e) {
      console.log('Error handling start bot creation:', e);
      await interaction.followUp({content:`Error: ${e}`});
    }
  },
}
