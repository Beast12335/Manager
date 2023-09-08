const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payment-add')
    .setDescription('Add payment records for a bot(admins only)')
    .addUserOption(option =>
    option.setName('bot')
    .setDescription('Choose the bot')
    .setRequired(true))
    .addUserOption(option =>
    option.setName('customer')
    .setDescription('Choose the Customer')
    .setRequired(true))
    .addStringOption(option =>
    option.setName('payment_type')
    .setDescription('Choose the type of payment')
    .setRequired(true)
    .addChoices({name:`Money`,value:`Money`},
    {name:`Invites`,value:`Invites`},
    {name:`Event`,value:`Event`}))
    .addStringOption(option =>
    option.setName('duration')
    .setDescription('Enter the duration of payment')
    .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    // Check if the user is an administrator
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply('You do not have permission to use this command.');
    }

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);
      const bot = interaction.options.getUserOptipn('bot')
      const customer = interaction.options.getUserOption('customer')
      const type = interaction.options.getStringOption('payment_type')
      const input = interaction.options.getStringOption('duration').trim().toLowerCase();
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
      
      const [rows] = await connection.execute('SELECT * FROM bots_db where id = ?',[bot.id]);

      if (rows.length === 0) {
        return interaction.followUp('Not a valid bot.');
      }
      if (expired){
        await connection.execute('insert into payments values (?,?,?,?,?,?)',[bot.id,customer.id, interaction.user.id,type,expired,'true'])
        const embed = new EmbedBuilder()
          .setTitle('Payment Added')
          .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
          .setDescription(`${type} Payment for <@${bot}> have been added`);

        await interaction.followUp({ embeds: [embed] }); }
      else{
      const emb = new EmbedBuilder()
      .setTitle('Invalid Duration')
      .setColor('Red')
      .setDescriptipn('Kindly enter a valid payment duration')
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp('An error occurred while fetching bot records.');
    }
  },
};
