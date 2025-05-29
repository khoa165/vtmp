import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { ICommand } from '@/commands/commands';

export const ping: ICommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction: CommandInteraction) => {
    // return interaction.reply('Pong!');
    const sent = await interaction.reply({ content: 'Pinging...' });
    await interaction.editReply(
      `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`
    );
  },
};
