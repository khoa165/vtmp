import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import axios from 'axios';

import { ICommand } from '@/commands/commands';
import { EnvConfig } from '@/config/env';

const API_URL = EnvConfig.get().API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const share: ICommand = {
  data: new SlashCommandBuilder()
    .setName('share')
    .setDescription('Share a job posting link')
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription('The job posting URL')
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const url = interaction.options.getString('url');

    // Call backend API to post job posting url
    try {
      const response = await api.request({
        method: 'POST',
        url: '/links',
        data: { url },
      });

      if (response.status == 201) {
        await interaction.reply(
          `Job link shared successfully!\n[View job posting](${url})`
        );
      } else {
        await interaction.reply('Failed to share job link.');
      }
    } catch (error: unknown) {
      console.error(error);
      await interaction.reply('An error occured while sharing the job link.');
    }
  },
};
