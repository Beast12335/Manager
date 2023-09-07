const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise'); // Import the MySQL library

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-bot')
        .setDescription('Deletes a  bot from a user')
        .addStringOption(option =>
        option.setName('bot_name')
        .setDescription('Enter the name of bot')
        .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()
        const bot = interaction.options.getString('bot_name')
        
        try {
            if (!interaction.user.permissions.has('ADMINISTRATOR')){
              await interaction.followUp('You can\'t use this command.')
              }
            const connection = await mysql.createConnection(process.env.DB_URL);
            const [rows] = await connection.execute('SELECT * FROM bots_db WHERE name = ?', [bot]);

            if (rows.length === 0) {
                await interaction.followUp('No information found for the specified user.');
                return;
            }

            const botInfo = rows[0];
            await connection.execute('delete from  bots_db where name = ?',[bot])

            const embed = new EmbedBuilder()
                .setTitle(`Bot Deleted`)
                .setDescription(`${bot} have been deleted successfully.`)
                .setColor(`Red`);

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.followUp('An error occurred while fetching bot information.');
        }
    },
}
