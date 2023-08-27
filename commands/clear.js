const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete messages from the channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.MANAGE_GUILD) ||  !userPermissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {
      return interaction.followUp('You can only delete between 1 and 100 messages.');
    }

    try {
      await interaction.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setTitle('Messages Deleted')
        .setDescription(`Deleted ${amount} messages from this channel.`)
        .setColor('Random') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'An error occurred while deleting messages.', ephemeral: true });
    }
  },
};

