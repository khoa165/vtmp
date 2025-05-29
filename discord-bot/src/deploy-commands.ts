import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { commands } from './commands/commands';
import { EnvConfig } from '@/config/env';

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = EnvConfig.get();

const rest: REST = new REST().setToken(DISCORD_TOKEN);

const commandsData = Object.values(commands).map((command) => command.data);

const deployCommands = async () => {
  try {
    console.log(
      `Started refreshing ${commandsData.length} application (/) commands.`
    );
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      {
        body: commandsData,
      }
    );

    console.log(
      `Successfully reloaded ${commandsData.length} application (/) commands.`
    );
  } catch (error: unknown) {
    console.error(error);
  }
};

deployCommands();
