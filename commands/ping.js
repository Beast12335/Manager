const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bot\'s ping.'),
    async execute(interaction) {
        await interaction.deferReply()
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields({name:'Ping', value:`${interaction.client.ws.ping}ms`})
            .setFooter({text:interaction.guild.name, iconURL:interaction.guild.iconURL()});

        await interaction.followUp({ embeds: [embed] });
    },
};
