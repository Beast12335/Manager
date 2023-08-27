const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const qr = require('qrcode');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createbot')
    .setDescription('Create a bot')
    .addUserOption(option =>
      option.setName('customer')
        .setDescription('Select the customer')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('bottype')
        .setDescription('Select bot type')
        .addChoice('Clan Bot', 'clan')
        .addChoice('Music', 'music')
        .addChoice('Security', 'security')
        .addChoice('Custom', 'custom')
        .addChoice('Channel', 'channel')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const customer = interaction.options.getUser('customer');
    const botType = interaction.options.getString('bottype');

    try {
      
      await interaction.followUp({ content: 'Starting the bot creating process. Let\'s continue in DMs.', ephemeral: true });
      
      await dmChannel.send('Starting the bot creating process.\nPlease send the bot ID.');

      const idCollector = dmChannel.createMessageCollector({ filter: msg => msg.author.id === customer.id, time: 60000 });

      idCollector.on('collect', async msg => {
        idCollector.stop();

        const botId = msg.content.trim();

        await dmChannel.send('Thanks! Now, please provide the bot name.');

        const nameCollector = dmChannel.createMessageCollector({ filter: msg => msg.author.id === customer.id, time: 60000 });

        nameCollector.on('collect', async nameMsg => {
          nameCollector.stop();

          const botName = nameMsg.content.trim();

          await dmChannel.send('Great! Now, please provide the payment duration (e.g., 1 month, 3 months).');

          const durationCollector = dmChannel.createMessageCollector({ filter: msg => msg.author.id === customer.id, time: 60000 });

          durationCollector.on('collect', async durationMsg => {
            durationCollector.stop();

            const paymentDuration = durationMsg.content.trim();

            await dmChannel.send('Awesome! Lastly, please provide the bot status.');

            const statusCollector = dmChannel.createMessageCollector({ filter: msg => msg.author.id === customer.id, time: 60000 });

            statusCollector.on('collect', async statusMsg => {
              statusCollector.stop();

              const botStatus = statusMsg.content.trim();

              const inviteRow = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setLabel('Invite Bot')
                    .setStyle('LINK')
                    .setURL('your-bot-invite-link')
                );

              await dmChannel.send({ content: 'Here\'s the invite link for the bot:', components: [inviteRow] });

              const customerRow = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setLabel('Click to Confirm')
                    .setStyle('PRIMARY')
                    .setCustomId('confirm')
                );

              await interaction.channel.send({ content: `Ping for ${customer}!`, components: [customerRow] });

              const confirmCollector = interaction.channel.createMessageComponentCollector({ filter: i => i.customId === 'confirm' && i.user.id === customer.id, time: 60000 });

              confirmCollector.on('collect', async () => {
                confirmCollector.stop();

                const alphanumericCode = Math.random().toString(36).substr(2, 10).toUpperCase();

                await qr.toDataURL(alphanumericCode, async (err, url) => {
                  if (err) {
                    console.error(err);
                    return;
                  }

                  const connection = await mysql.createConnection(dbConfig);

                  const newBot = new Bot({
                    botId,
                    botName,
                    customerId: customer.id,
                    paymentType,
                    paymentDuration,
                    status: botStatus,
                  });

                  await newBot.save();

                  await connection.execute(
                    'INSERT INTO bot_details (user_id, customer_id, bot_id, alphanumeric_code, bot_name, payment_type, payment_duration) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [customer.id, customer.id, botId, alphanumericCode, botName, paymentType, paymentDuration]
                  );

                  await interaction.channel.send({
                    content: `${botName} was created by ${customer} (${customer.id}). ${botName} is a ${botType}.\nYou can invite it here: your-bot-invite-link`,
                  });

                  await dmChannel.send('Here\'s a QR code with your random alphanumeric code:');
                  await dmChannel.send({ files: [url] });
                });
              });
            });
          });
        });
      });

      idCollector.on('end', collected => {
        if (collected.size === 0) {
          dmChannel.send('Time is up! Please restart the bot creating process if you\'d like to continue.');
        }
      });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'An error occurred during the bot creating process.', ephemeral: true });
    } finally {
      connection.close();
    }
  },
};
