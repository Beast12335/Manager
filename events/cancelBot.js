const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  name:'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'cancel_bot') return;
    await interaction.deferUpdate();
    try {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageServer
        ) ||
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
      const channel = embed.fields[0].value
      const c = interaction.client.channels.cache.get(channel)
      const cancel = new EmbedBuilder()
      .setTitle('Bot Creation Stopped')
      .setDescription('Bot creation was stopped due to some internal reasons.')
      .setColor('Red')
      .setThumbnail();
      const emb = EmbedBuilder.from(embed).addFields({name:`**Cancelled By:**`,value:`${interaction.user.username}`}).setTitle('Bot Creation Cancelled');
      await c.send({embeds:[cancel]});
      await interaction.updateReply({embeds:[emb]})
      console.log(embed)
    } catch (e) {
      console.log('Error handling cancel bot creation:', e);
      await interaction.followUp({content:`Error: ${e}`});
    }
  },
};
