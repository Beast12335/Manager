const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder, MessageCollector,
  EmbedBuilder,StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
  name:'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'restart_3') return;
    await interaction.deferReply();
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
      
      const p = await interaction.channel.send('Please send the **Bot Id**. You have 2 minutes to do so')
      const collect = await interaction.channel.createMessageCollector({time:120000})
      collect.on('collect', async(t) =>{
        collect.stop()
        const nEmbed = interaction.message.embeds[0]
        const emb = EmbedBuilder.from(nEmbed).addFields({name:`**Bot Id:**`,value:t.content});
        const button = new ButtonBuilder()
        .setStyle('Link')
        .setLabel('Invite Bot')
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${t.content}&permissions=0&scope=bot%20applications.commands`);
        const confirm = new ButtonBuilder()
        .setStyle('Success')
        .setLabel('Confirm')
        .setCustomId('confirm_details');
        const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle('Danger')
        const edit = new ButtonBuilder()
        .setCustomId('edit')
        .setLabel('Edit')
        .setStyle('Secondary')
        const row = new ActionRowBuilder()
        .addComponents(confirm,edit,cancel,button)
        await interaction.editReply({embeds:[emb], components:[row]})
        await p.delete()
        await t.delete()
        });
      collect.on('end', async(collected) =>{
        if(collected.size == '0'){
          await interaction.channel.send('Time Out. Click on the restart button to continue further')
          const button = new ButtonBuilder()
          .setStyle('Secondary')
          .setLabel('Restart')
          .setCustomId('restart_3')
          const row = new ActionRowBuilder()
          .addComponents(button)
          await interaction.channel.send({embeds:[newEmbed], components:[row]})
          await interaction.deleteReply()
          await p.delete()
          await t.delete()
          }
        });
    } catch (e) {
      console.log('Error handling  restart 3  button:', e);
      await interaction.followUp({content:`Error: ${e}`, ephemeral:true});
    }
  },
};
