const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder, MessageCollector,
  EmbedBuilder,StringSelectMenuBuilder
} = require('discord.js');
const mysql = require('mysql2/promise');
const {name} = require('./helper.js')

module.exports = {
  name:'interactionCreate',
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'payment') return;
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
      const newEmbed = EmbedBuilder.from(embed).addFields({name:`**Payment Type:**`,value:type,inline:true})
      await interaction.editReply({embeds:[newEmbed], components:[]});
      const msg = await interaction.channel.send('Please enter the payment duration. Ex. 2d/ 5min / 1m')
      const collector = interaction.channel.createMessageCollector({time:120000})
      collector.on('collect', async(m) =>{
        collector.stop()
        const input = m.content.trim().toLowerCase();
        const duration = parseInt(input);
        let expired;
        
        if (!isNaN(duration)) {
          if (input.includes('s')) {
            expired = new Date(Date.now() + duration * 1000); // Seconds
          } else if (input.includes('min')) {
            expired = new Date(Date.now() + duration * 60000); // Minutes
          } else if (input.includes('h')) {
            expired = new Date(Date.now() + duration * 3600000); // Hours
          } else if (input.includes('d')) {
            expired = new Date(Date.now() + duration * 86400000); // Days
          } else if (input.includes('m')) {
            expired = new Date();
            expired.setMonth(expired.getMonth() + duration);
          } else if (input.includes('y')) {
            expired = new Date();
            expired.setFullYear(expired.getFullYear() + duration);
          }
        }
        
        if (expired) {
          console.log(expired)
          const emb = EmbedBuilder.from(newEmbed).addFields({name:`**Payment Duration:**`,value:expired.toString(),inline:true})
          await interaction.editReply({embeds:[emb], components:[]})
          await msg.delete()
          await m.delete()
          name()
        } else {
          await interaction.channel.send('Invalid format. Please use (number)(duration), e.g., "2d" for 2 days.');
        }
        });
      collector.on('end', async(collected) =>{
        if(collected.size == '0'){
          const x = await interaction.channel.send('Time Out. Click on the restart button to continue further')
          const button = new ButtonBuilder()
          .setStyle('Secondary')
          .setLabel('Restart')
          .setCustomId('restart')
          const row = new ActionRowBuilder()
          .addComponents(button)
          await interaction.channel.send({embeds:[newEmbed], components:[row]})
          await interaction.deleteReply()
          await msg.delete()
          await x.delete()
          };
        });
    } catch (e) {
      console.log('Error handling  payment type menu:', e);
      await interaction.followUp({content:`Error: ${e}`});
    }
  },
};
