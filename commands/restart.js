const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restartbot')
    .setDescription('Restart a bot process (admins only)'),
  async execute(interaction) {
    await interaction.deferReply()
    // Check if the user is an administrator
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.followUp('You do not have permission to use this command.');
    }

    // Get a list of running PM2 processes
    const { stdout, stderr } = await exec('pm2 jlist');

    if (stderr) {
      console.error(`Error executing PM2 command: ${stderr}`);
      return interaction.followUp('An error occurred while fetching process information.');
    }

    const processes = JSON.parse(stdout);

    if (!processes || processes.length === 0) {
      return interaction.followUp('No running processes found.');
    }

    // Create a select menu with process names
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('restart_process')
      .setPlaceholder('Select a process to restart');

    for (const process of processes) {
      selectMenu.addOptions({
        label: process.name,
        value: process.name,
      });
    }

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
      .setTitle('Running PM2 Processes')
      .setDescription('Select a process to restart:')
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

    await interaction.followUp({ embeds: [embed], components: [row] });
  },
};
