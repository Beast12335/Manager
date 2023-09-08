const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payment-remove')
    .setDescription('Deletes all payment records for a bot(admins only)')
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
      const bot = interaction.options.getUserOptipn('bot')
      
      const [rows] = await connection.execute('SELECT * FROM bots_db where id = ?',[bot.id]);

      if (rows.length === 0) {
        return interaction.followUp('Not a valid bot.');
      }
      await connection.execute('delete from payments where bot = ?',[bot.id])
      const embed = new EmbedBuilder()
          .setTitle('Payment Removed')
          .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
          .setDescription(`All payment records for <@${bot}> have been removed.`);

        await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp('An error occurred while fetching bot records.');
    }
  },
};
