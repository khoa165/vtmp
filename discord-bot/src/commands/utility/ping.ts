import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { ICommand } from '@/commands/commands';

export const pingCommand: ICommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction: CommandInteraction) => {
    return interaction.reply('Pong!');
  },
};
