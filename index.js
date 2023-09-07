//const {Canvas} = require('canvas');
const {Client, GatewayIntentBits, Collection} = require('discord.js');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const fs = require('fs');
const cron = require('node-cron');
const mysql = require('mysql2/promise'); // Import the MySQL library
require('dotenv').config();

const client = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]});
client.commands = new Collection();

const BOT_TOKEN = process.env.BOT_TOKEN;

//const connection = await mysql.createConnection(process.env.DB_URL)
// Function to register commands
const registerCommands = async () => {
  try {
    const commands = [];
    const commandFiles = fs
      .readdirSync('./commands')
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
    }

    const rest = new REST({version: '9'}).setToken(BOT_TOKEN);
    await rest.put(
      Routes.applicationCommands(client.user.id),
      {
        body: commands,
      }
    );

    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
};

// Event handler when the bot is ready
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}.`);
  registerCommands();
  });
// Increase the maximum listener limit for EventEmitter
require('events').EventEmitter.defaultMaxListeners = 25; // Adjust the value as needed

async function deleteExpiredBots() {
  const currentTime = new Date();
  const connection = await mysql.createConnection(process.env.DB_URL);

  try {
    const [ rows ] = await connection.execute('select *  FROM bots_db');
    console.log(rows)
    for (let i=0;i<rows.length;i++){
      const date = new Date(rows[i].duration)
      console.log(date <= currentTime)
      if (date <= currentTime) {
        const user = await client.users.fetch(rows[i].customer)
        await user.send('beast')
                                     }
      }
  } catch (error) {
    console.error('Error deleting rows:', error);
  } finally {
    await connection.end();
  }
}

cron.schedule('*/3 * * * *', async () => {
  console.log('chalo')
  deleteExpiredBots()
  });

// Event handler for interactions
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const commandName = interaction.commandName;
    const command = client.commands.get(commandName);

    if (!command) return;
    await command.execute(interaction);
  }
});

// Event handlers for other events in the 'events' folder
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const eventHandler = require(`./events/${file}`);
  client.on(eventHandler.name, (...args) => eventHandler.execute(...args));
}
// Log in the bot
client.login(BOT_TOKEN)
