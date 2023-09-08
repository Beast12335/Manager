const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bots')
    .setDescription('Shows all bots for a user')
    .addUserOption(option => option
      .setName('user')
      .setDescription('Select a user (optional)')
      .setRequired(false)),
  async execute(interaction) {
    await interaction.deferReply()
    const userOption = interaction.options.getUser('user');
    const userId = userOption ? userOption.id : interaction.user.id;

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);
      const [rows] = await connection.execute('SELECT * FROM bots_db WHERE customer = ?', [userId]);

      if (rows.length === 0) {
        return interaction.followUp('No information found for the specified user.');
      }

      const embed = new EmbedBuilder()
        .setTitle(`Bots for <@${userId}>`)
        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .setDescription(` `);

      rows.forEach((row, index) => {
        embed.addFields({name:`${index + 1}. `,value: row.name + ` | ${row.type} | ${row.pay_type} payment `});
      });

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp('An error occurred while fetching information.');
    }
  },
};
