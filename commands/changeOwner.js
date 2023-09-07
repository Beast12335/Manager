const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise'); // Import the MySQL library

module.exports = {
    data: new SlashCommandBuilder()
        .setName('change-owner')
        .setDescription('Change the owner of a bot')
        .addStringOption(option =>
        option.setName('bot_name')
        .setDescription('Enter the name of bot')
        .setRequired(true))
        .addUserOption(option => option
            .setName('user')
            .setDescription('Select a user.')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()
        const bot = interaction.options.getString('bot_name')
        const user = interaction.options.getUser('user');
        
        try {
            if (!interaction.user.permissions.has('ADMINISTRATOR')){
              await interaction.followUp('You can\'t use this command.')
              }
            const connection = await mysql.createConnection(process.env.DB_URL);
            const [rows] = await connection.execute('SELECT * FROM bots_db WHERE customer = ?', [user.id]);
            await connection.end();

            if (rows.length === 0) {
                await interaction.followUp('No information found for the specified user.');
                return;
            }

            const botInfo = rows[0];
            await connection.execute('update bots_db set customer = ? where name = ?',[user.id,bot])

            const embed = new EmbedBuilder()
                .setTitle(`${user.tag}`)
                .addFields({name:' ', value:`<@${user.id}> have been set as the owner of ${botInfo.name}`})
                .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.followUp('An error occurred while fetching bot information.');
        }
    },
};
