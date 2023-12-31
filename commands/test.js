const { EmbedBuilder,ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('toggle')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    await interaction.deferReply({ephemeral:true})
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.followUp('You do not have permission to use this command.');
    }
    console.log(interaction.targetMessage.components)
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
          `Removed the ${interaction.commandName} option from the select menu.`
        );
      } else {
        message.components[0].components[0].options.splice(0,0,{label:`dw`,value:`dw`})
        await message.edit({components:[message.components[0]]})
        interaction.followUp(
          `The ${interaction.commandName} option was not found in the select menu.`
        );
      }
    } else {
      interaction.followUp('The message does not contain a select menu.');
    };
  },
}
