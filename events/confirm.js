const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,StringSelectMenuBuilder
} = require('discord.js');
const mysql = require('mysql2/promise');
const qrcode = require('qrcode')

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'confirm') return;
    
    await interaction.deferUpdate()
    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.followUp({ content: 'You do not have permission to claim this ticket.', ephemeral: true });
      }
     // const connection = await mysql.createConnection(process.env.DB_URL);
      const embed = interaction.message.embeds[0]
      
      function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
        return code;
      }
      const randomCode = generateRandomCode(6);
      const qrCode = await qr.toDataURL(randomCode);
      const orderEmbed = new EmbedBuilder()
      .setTitle('Bot Created')
      .setColor('Green')
      .setDescription(`${embed.fields[6].value} is **Online** and ready to be used. \n 
<@${embed.fields[7].value}> is a ${embed.fields[3].value} and got added to <@${embed.fields[1].value} wallet.
To get started type \`/help\`
      > [Click here](https://www.google.com) to invite the bot.
      > More details about the bot have been sent to you via **DM**s
`)
      .setThumbnail(interaction.guild.iconURL())
      
      const orderChannel = interaction.client.channels.cache.get(embed.fields[0].value)
      const creator = interaction.client.users.cache.get(embed.fields[2].value).username
      const customer = await interaction.client.users.fetch(embed.fields[1].value)
      const message = '***IF YOU ARE HAVING PROBLEMS, or need a restart, or something else! THEN SEND US THIS INFORMATION!!!***> This includes: `BotChanges`, `Restarts`, `Deletions`, `Adjustments & Upgrades`> *This message is also a proof, that you are the original Owner of this BOT*'
      const dmEmbed = new EmbedBuilder()
      .setTitle('')
      .setThumbnail(interaction.guild.iconURL())
      .setColor('Blue')
      .setDescription('')
      .setImage('attachment://qrcode.png')
      await orderChannel.send({content:`<@${embed.fields[1].value}> Created By: ${creator} | ${embed.fields[2].value}`,embeds:[orderEmbed]})
      const newEmbed = EmbedBuilder.from(embed).addFields({name:`**Security Code:**`,value:randomCode,inline:true});
      await interaction.editReply({embeds:[newEmbed]});
      const msg = await customer.send({content:message,embeds:[dmEmbed],files:({attachment:qrCode,name:'qrcode.png'})})
      await msg.pin()
      await customer.send({content:`<@${embed.fields[1].value}> Created By: ${creator} | ${embed.fields[2].value}`,embeds:[orderEmbed]})
} catch (error) {
      console.error('Error handling confirm bot creation button interaction:', error);
      if (error.code == 50007){
        await orderChannel.send({content:`<@${embed.field[1].value}> Your dms are closed. Kindly open the DMs and then ask someone from staff to send you the details`})
        const button = new ButtonBuilder()
        .setStyle('Primary')
        .setLabel('Dm details')
        .setCustomId('dm')
        const row = new ActionRowBuilder()
        .addComponents(button)
        await interaction.editReply({embeds:[newEmbed], components:[row]})
        }
    }
  },
}
