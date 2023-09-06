const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Set up ticket configuration (requires MANAGE_SERVER or ADMINISTRATOR)')
        .addStringOption(option => option
            .setName('message')
            .setDescription('Set the embed description')
            .setRequired(true))
        .addStringOption(option => option
            .setName('menus')
            .setDescription('Add select menus (comma-separated)')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()
        // Check if the user has MANAGE_SERVER or ADMINISTRATOR permissions
        if (!interaction.member.permissions.has('MANAGE_GUILD') || !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.followUp('You do not have permission to use this command.');
        }

        const message = interaction.options.getString('message');
        const menuOptions = interaction.options.getString('menus').split(',');

        // Create select menus
        const selectMenus = [];
        for (const option of menuOptions) {
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(order)
                .setPlaceholder(`Choose your order`);

            // Add options to the select menu (customize as needed)
            selectMenu.addOptions([
                {
                    label: 'Option 1',
                    value: 'option1',
                },
                {
                    label: 'Option 2',
                    value: 'option2',
                },
            ]);

            selectMenus.push(selectMenu);
        }

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('Ticket Setup')
            .setDescription(message)
            .setThumbnail(interaction.guild.iconURL())
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setFooter({name:interaction.guild.name, iconURL:interaction.guild.iconURL()});

        // Create the action row with select menus
        const row = new ActionRowBuilder().addComponents(selectMenus);

        // Send the embed with select menus
        await interaction.followUp({ embeds: [embed], components: [row] });
    },
};
