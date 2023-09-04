async function name(interaction,EmbedBuilder,ButtonBuilder,ActionRowBuilder){
  const u = await interaction.channel.send('Please send the **Bot Name**. You have 2 minutes to do so')
  const collector = await interaction.channel.createMessageCollector({time:120000})
  collector.on('collect', async(m) =>{
    collector.stop()
    const newEmbed = interaction.message.embeds[0]
    const emb = EmbedBuilder.from(newEmbed).addFields({name:`**Bot Name:**`,value:m.content});
    await interaction.editReply({embeds:[emb], components:[]})
    await m.delete()
    await u.delete()
    
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
        .setCustomId('restart')
        const row = new ActionRowBuilder()
        .addComponents(button)
        await interaction.channel.send({embeds:[newEmbed], components:[row]})
        await interaction.deleteReply()
        await p.delete()
        await t.delete()
        }
      });
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
      await u.delete()
      await m.delete()
      }
    });
}

module.exports = { name };
