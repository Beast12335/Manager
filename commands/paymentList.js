const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payment-info')
    .setDescription('List all payment records for a bot(admins only)')
    .addUserOption(option =>
    option.setName('bot')
    .setDescription('Choose the bot')
    .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    // Check if the user is an administrator
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply('You do not have permission to use this command.');
    }

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);
      const bot = interaction.options.getUser('bot')
      
      const [rows] = await connection.execute('SELECT * FROM bots_db where id = ?',[bot.id]);

      if (rows.length === 0) {
        return interaction.followUp('Not a valid bot.');
      }
      await connection.execute('select * from payments where bot = ? order by duration desc',[bot.id])
      let fields = ''
      for (let i=0;i<rows.length;i++){
        fields+= i+1 +` | ${rows[i].type} | ${rows[i].duration}`
        }
      const embed = new EmbedBuilder()
          .setTitle('Payment List')
          .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
          .setDescription(`${fields}`);

        await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp('An error occurred while fetching bot records.');
    }
  },
};
