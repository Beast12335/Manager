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
      await interaction.editReply({embeds:[newEmbed], components:[]});
      const msg = await interaction.channel.send('Please enter the **Bot Name**. You have 2 minutes to do so')
      const collector= interaction.channel.createMessageCollector({time:120000})
      collector.on('collect', async(m) =>{
        collector.stop()
        const emb = EmbedBuilder.from(newEmbed).addFields({name:`**Bot Name:**`,value:m.content});
        await interaction.editReply({embeds:[emb]})
        await m.delete()
        await msg.delete()
        });
      collector.on('end', async(collected) =>{
        if(collected.size == '0'){
          await interaction.channel.send('Time Out. Click on the restart button to continue further')
          const button = new ButtonBuilder()
          .setStyle('Secondary')
          .setLabel('Restart')
          .setCustomId('restart')
          const row = new ActionRowBuilder()
          .addComponents(button)
          await interaction.channel.send({embeds:[newEmbed], components:[row]})
          await interaction.deleteReply()
          }
        });
    } catch (e) {
      console.log('Error handling  bot creation type menu:', e);
      await interaction.followUp({content:`Error: ${e}`});
    }
  },
};
