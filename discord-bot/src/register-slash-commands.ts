import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { commands } from './commands/commands';
import { EnvConfig } from '@/config/env';

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = EnvConfig.get();

const rest = new REST().setToken(DISCORD_TOKEN);

const commandsData = Object.values(commands).map((command) => command.data);

export const deployCommands = async () => {
  try {
    console.log('Started refreshing application slash commands');
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      {
        body: commandsData,
      }
    );
  } catch (error: unknown) {
    console.error(error);
  }
};

deployCommands();
