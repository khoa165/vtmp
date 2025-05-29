import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { ping } from './utility/ping';
import { share } from '@/commands/utility/share';

export interface ICommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands: Record<string, ICommand> = {
  ping,
  share,
};
