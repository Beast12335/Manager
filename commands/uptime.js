const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Get the bot\'s uptime'),
  async execute(interaction) {
    await interaction.deferReply()
    const uptime = moment.duration(interaction.client.uptime);

    const embed = new EmbedBuilder()
      .setTitle('Bot Uptime')
      .setDescription(`The bot has been online for ${uptime.days()} days, ${uptime.hours()} hours, ${uptime.minutes()} minutes, and ${uptime.seconds()} seconds.`)
      .setColor('Random'); // Blue color

    try {
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while sending the response.', ephemeral: true });
    }
  },
};

