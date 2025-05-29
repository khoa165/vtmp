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

client.login(token);
