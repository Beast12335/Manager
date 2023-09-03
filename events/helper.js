async function name(interaction,EmbedBuilder,ButtonBuilder,ActionRowBuilder){
  const u = await interaction.channel.send('Please send the **Bot Name**. You have 2 minutes to do so')
  const collector = await interaction.channel.createMessageCollector({time:120000})
  collector.on('collect', async(m) =>{
    collector.stop()
    const newEmbed = interaction.message.embeds[0]
    const emb = EmbedBuilder.from(newEmbed).addFields({name:`**Demoo:**`,value:m.content});
    await interaction.editReply({embeds:[emb]})
    await m.delete()
    await u.delete()
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

async function id(interaction,EmbedBuilder,ButtonBuilder,ActionRowBuilder){
  const u = await interaction.channel.send('Please send the **Bot Id**. You have 2 minutes to do so')
  const collector = await interaction.channel.createMessageCollector({time:120000})
  collector.on('collect', async(m) =>{
    collector.stop()
    const newEmbed = interaction.message.embeds[0]
    const emb = EmbedBuilder.from(newEmbed).addFields({name:`**Id:**`,value:m.content});
    const button = new ButtonBuilder()
    .setStyle('Link')
    .setLabel('Invite Bot')
    .setURL('https://www.google.com');
    const confirm = new ButtonBuilder()
    .setStyle('Success')
    .setLabel('Confirm')
    .setCustomId('confirm_details');
    const row = new ActionRowBuilder()
    .addComponents(button,confirm)
    await interaction.editReply({embeds:[emb], components:[row]})
    await m.delete()
    await u.delete()
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
module.exports = { id };
