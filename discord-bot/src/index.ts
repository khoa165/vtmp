import { Client, GatewayIntentBits, Interaction } from 'discord.js';
import { EnvConfig } from '@/config/env';
import { commands } from '@/commands/commands';

const token = EnvConfig.get().DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('Discord bot is ready! 🤖');
});

client.on('interactionCreate', async (interaction: Interaction) => {
  console.log('hello');
  if (!interaction.isChatInputCommand()) {
    console.log(1);
    return;
  }

  const command = commands[interaction.commandName];
  console.log(command);
  if (!command) {
    console.log(2);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error: unknown) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error executing this command!',
        ephemeral: true,
      });
    }
  }
});

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
