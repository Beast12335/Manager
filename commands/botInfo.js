const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise'); // Import the MySQL library

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bots')
        .setDescription('Get bot information from the MySQL table.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Select a user to get information about bots.')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()
        const botUser = interaction.options.getUser('user');
        
        try {
            const connection = await mysql.createConnection(process.env.DB_URL);
            const [rows] = await connection.execute('SELECT * FROM bots_db WHERE customer = ?', [botUser.id]);
            await connection.end();

            if (rows.length === 0) {
                await interaction.followUp('No information found for the specified user.');
                return;
            }

            const botInfo = rows[0];

            const embed = new EmbedBuilder()
                .setTitle(`Bots Info - ${botUser.tag}`)
                .addFields({name:'Bot Name', value:botInfo.name},
                           {name:'Description', value:botInfo.customer},
                          {name:'Owner', value:`<@${botInfo.id}>`})
                .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.followUp('An error occurred while fetching bot information.');
        }
    },
};
