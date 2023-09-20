const { EmbedBuilder,ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('music')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    await interaction.deferReply({ephemeral:true})
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.followUp('You do not have permission to use this command.');
    }
    const message = interaction.targetMessage
    if (message.components && message.components.length > 0) {
      // Find the index of the option with the same name as the command
      const optionIndex = message.components[0].components.findIndex(
        (component) => component.customId === interaction.commandName
      );
    
      // If the option exists, remove it
      if (optionIndex !== -1) {
        message.components[0].components.splice(optionIndex, 1);
    
        // Edit the message to update the select menu
        await message.edit({components: [message.components[0]]});
    
        interaction.followUp(
          `Removed the ${interaction.commandName} bot option from the select menu.`
        );
      } else {
        message.components[0].components[0].options.splice(0,0,{label:`Music Bot`,value:`music`})
        await message.edit({components:[message.components[0]]})
        interaction.followUp(
          `Added ${interaction.commandName} bot option.`
        );
      }
    } else {
      interaction.followUp('The message does not contain a select menu.');
    };
  },
}
