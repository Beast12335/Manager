const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a user to a channel')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to add')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
      return interaction.reply({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const channel = interaction.channel.id

    try {
      await channel.permissionOverwrites.create(user, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
      });

      const embed = new EmbedBuilder()
        .setTitle('User Added')
        .setDescription(`Added ${user.tag} to ${channel.name}`)
        .setColor('Random') // Yellowish color
        .setThumbnail(user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while adding the user to the channel.', ephemeral: true });
    }
  },
};

