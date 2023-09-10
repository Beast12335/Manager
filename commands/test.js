const { EmbedBuilder,ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('toggle')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    await interaction.deferReply({ephemeral:true})
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .addFields({name:'Ping', value:`${interaction.client.ws.ping}ms`})
      .setFooter({text:interaction.guild.name, iconURL:interaction.guild.iconURL()});
    console.log(interaction)
    await interaction.followUp({ embeds: [embed] });
  },
}
