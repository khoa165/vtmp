import {
  CommandInteraction,
  SlashCommandBuilder,
  InteractionResponse,
} from 'discord.js';
import { pingCommand } from './utility/ping';

export interface ICommand {
  data: SlashCommandBuilder;
  execute: (
    interaction: CommandInteraction
  ) => Promise<InteractionResponse<boolean>>;
}

export const commands: Record<string, ICommand> = {
  pingCommand,
};
