const {
  PermissionsBitField,
  ActionRowBuilder, AttachmentBuilder,
  ButtonBuilder,
  EmbedBuilder,StringSelectMenuBuilder
} = require('discord.js');
const qrcode = require('qrcode')

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'dm') return;
    
    await interaction.deferUpdate()
    
    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.followUp({ content: 'You do not have permission to claim this ticket.', ephemeral: true });
      }
      const embed = interaction.message.embeds[0]
      const orderChannel = interaction.client.channels.cache.get(embed.fields[0].value)
      const creator = interaction.client.users.cache.get(embed.fields[2].value).username
      const customer = await interaction.client.users.fetch(embed.fields[1].value)
    
      const qrCode = await qrcode.toDataURL(embed.fields[7].value);
      const imageBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
      const file = new AttachmentBuilder(imageBuffer,'qrcode.png')
      
      const orderEmbed = new EmbedBuilder()
            .setTitle('Bot Created')
            .setColor('Green')
            .setDescription(`${embed.fields[6].value} is **Online** and ready to be used. \n 
      <@${embed.fields[7].value}> is a ${embed.fields[3].value} and got added to <@${embed.fields[1].value}> wallet.
      To get started type \`/help\` \n
            > [Click here](https://discord.com/api/oauth2/authorize?client_id=${embed.fields[7].value}&permissions=8&scope=bot%20applications.commands) to invite the bot. \n
          > More details about the bot have been sent to you via **DM**s
      `)
            .setThumbnail(interaction.guild.iconURL())
            
            
      const message = '***IF YOU ARE HAVING PROBLEMS, or need a restart, or something else! THEN SEND US THIS INFORMATION!!!*** \n > This includes: `BotChanges`, `Restarts`, `Deletions`, `Adjustments & Upgrades` \n > *This message is also a proof, that you are the original Owner of this BOT*'
      const dmEmbed = new EmbedBuilder()
      .setTitle(' ')
      .setThumbnail(interaction.guild.iconURL())
      .setColor('Blue')
      .setDescription(`
**Path:** \n
 > /home/bots/${embed.fields[3].value}/${embed.fields[6].value}
 
**Command:** \n
 > pm2 list | grep /"${embed.fields[6].value}/"
                        
**Application Information:** \n
 > Link: \`https://discord.com/developers/applications/${embed.fields[7].value}\` \n 
 > Name : \`${embed.fields[6].value}\` \n
 > Original Owner: \`${customer.username}\``)
     // .setI
      const msg = await customer.send({content:message,embeds:[dmEmbed],files:[file]})
      await msg.pin()
      await customer.send({content:`<@${embed.fields[1].value}> | Created By: ${creator} (${embed.fields[2].value})`,embeds:[orderEmbed]})
} catch (error) {
      console.error('Error handling confirm dm button interaction:', error);
      if (error.code == 50007){
        const newEmb = interaction.message.embeds[0]
        const orderChannel = interaction.client.channels.cache.get(newEmb.fields[0].value)
        await orderChannel.send({content:`<@${newEmb.fields[1].value}> Your dms are closed. Kindly open the DMs and then ask someone from staff to send you the details`})
        const button = new ButtonBuilder()
        .setStyle('Primary')
        .setLabel('Dm details')
        .setCustomId('dm')
        const row = new ActionRowBuilder()
        .addComponents(button)
        await interaction.editReply({embeds:[newEmb], components:[row]})
        }
    }
  },
}
