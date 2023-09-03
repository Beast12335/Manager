async function name(){
  const u = await interaction.channel.send('Please send the **Bot Name**. You have 2 minutes to do so')
  const collector = await interaction.channel.createMessageCollector({time:120000})
  collector.on('collect', async(m) =>{
    collector.stop()
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
      }
    });
}
module.exports = { name };
