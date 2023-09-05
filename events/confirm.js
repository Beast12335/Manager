const {
  PermissionsBitField,
  ActionRowBuilder, AttachmentBuilder,
  ButtonBuilder,
  EmbedBuilder,StringSelectMenuBuilder
} = require('discord.js');
const mysql = require('mysql2/promise');
const qrcode = require('qrcode')

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'confirm_details') return;
    console.log('beast')
    await interaction.deferUpdate()
    const embed = interaction.message.embeds[0]
    const orderChannel = interaction.client.channels.cache.get(embed.fields[0].value)
    const creator = interaction.client.users.cache.get(embed.fields[2].value).username
    const customer = await interaction.client.users.fetch(embed.fields[1].value)
    
    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.followUp({ content: 'You do not have permission to claim this ticket.', ephemeral: true });
      }
      const connection = await mysql.createConnection(process.env.DB_URL);
      console.log('1')
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
      const qrCode = await qrcode.toDataURL(randomCode);
      const imageBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
      const file = new AttachmentBuilder(imageBuffer,'qrcode.png')
      const orderEmbed = new EmbedBuilder()
      .setTitle('Bot Created')
      .setColor('Green')
      .setDescription(`${embed.fields[6].value} is **Online** and ready to be used. \n 
<@${embed.fields[7].value}> is a ${embed.fields[3].value} and got added to <@${embed.fields[1].value}> wallet.
To get started type \`/help\`
      > [Click here](https://discord.com/api/oauth2/authorize?client_id=${embed.fields[7].value}&permissions=8&scope=bot%20applications.commands) to invite the bot.
    > More details about the bot have been sent to you via **DM**s
`)
     const [ row ] = await connection.execute('insert into bots_db values(?,?,?,?,?,?,?)',[embed.fields[1].value,embed.fields[2].value,embed.fields[3].value,embed.fields[4].value,embed.fields[5].value,embed.fields[6].value,embed.fields[7].value])
} catch (error) {
      console.error('Error handling confirm bot creation button interaction:', error);
      if (error.code == 50007){
        const newEmb = interaction.message.embeds[0]
        await orderChannel.send({content:`<@${embed.field[1].value}> Your dms are closed. Kindly open the DMs and then ask someone from staff to send you the details`})
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
