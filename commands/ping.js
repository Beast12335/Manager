const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bot\'s ping.'),
    async execute(interaction) {
        await interaction.deferReply()
        const embed = new EmbedBuilder()
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .addField('Ping', `${interaction.client.ws.ping}ms`)
            .setFooter(interaction.guild.name, interaction.guild.iconURL());

        await interaction.followUp({ embeds: [embed] });
    },
};
