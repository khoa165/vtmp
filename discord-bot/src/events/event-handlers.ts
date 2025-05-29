import { Client, Events, Interaction, MessageFlags } from 'discord.js';
import { commands } from '@/commands/commands';

interface IEventHandler<T extends unknown[]> {
  name: string;
  once?: boolean;
  execute: (...args: T) => void | Promise<void>;
}

export const ready: IEventHandler<[Client?]> = {
  name: Events.ClientReady,
  once: true,
  execute: (client?: Client) => {
    console.log(`Discord bot is ready! Logged in as ${client?.user?.tag}`);
  },
};

export const interactionCreate: IEventHandler<[Interaction]> = {
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
    // Check if this is slash command
    if (!interaction.isChatInputCommand()) return;

    const command = commands[interaction.commandName];
    if (!command) {
      console.log(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error: unknown) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'There was an error executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
