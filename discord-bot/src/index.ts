import { Client, GatewayIntentBits } from 'discord.js';
import { EnvConfig } from '@/config/env';
import { ready, interactionCreate } from '@/events/event-handlers';

const token = EnvConfig.get().DISCORD_TOKEN;

const client: Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const eventHandlers = [ready, interactionCreate];

for (const eventHandler of eventHandlers) {
  if (eventHandler.once) {
    client.once(eventHandler.name, (...args) => eventHandler.execute(...args));
  } else {
    client.on(eventHandler.name, (...args) => eventHandler.execute(...args));
  }
}

// client.once(Events.ClientReady, () => {
//   console.log('Discord bot is ready! 🤖');
// });

// client.on(Events.InteractionCreate, async (interaction: Interaction) => {
//   // Check if this is slash command
//   if (!interaction.isChatInputCommand()) return;

//   const command = commands[interaction.commandName];
//   if (!command) {
//     console.log(`No command matching ${interaction.commandName} was found.`);
//     return;
//   }

//   try {
//     await command.execute(interaction);
//   } catch (error: unknown) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({
//         content: 'There was an error executing this command!',
//         flags: MessageFlags.Ephemeral,
//       });
//     } else {
//       await interaction.reply({
//         content: 'There was an error executing this command!',
//         flags: MessageFlags.Ephemeral,
//       });
//     }
//   }
// });

// client.on('messageCreate', (message) => {
//   if (message.author.bot) return;
//   if (message.content === '!ping') {
//     message.reply('Pong!');
//   }
// });

// client.on('messageCreate', (message) => {
//   if (!message.member) {
//     return;
//   }
//   console.log(`${message.member.displayName} send ${message.content}`);
// });

client.login(token);
