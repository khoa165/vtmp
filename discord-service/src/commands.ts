import { EnvConfig } from '@/config/env';
import axios from 'axios';
import {
  SlashCommand,
  CommandContext,
  SlashCreator,
  CommandOptionType,
} from 'slash-create';
import { z } from 'zod';

const API_URL = EnvConfig.get().API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const urlSchema = z.string().url();

export class PingCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'ping',
      description: 'Replies with Pong!',
    });
  }

  override run = async (ctx: CommandContext) => {
    console.log(ctx.user);
    return ctx.send(`Hello, ${ctx.user.username}`);
  };
}

export class ShareLinkCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'share',
      description: 'Share a job posting url',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'url',
          description: 'The job posting URL',
          required: true,
        },
      ],
    });
  }

  override run = async (ctx: CommandContext) => {
    const url: string = ctx.options.url;

    const parsed_url = urlSchema.safeParse(url);
    if (!parsed_url.success) {
      return ctx.send('❌ Please provide a valid URL');
    }

    try {
      const response = await api.request({
        method: 'POST',
        url: '/links',
        data: { url: parsed_url.data },
      });

      if (response.status === 201) {
        return ctx.send(
          `✅ Job link shared successfully!\n[View job posting](${parsed_url.data})`
        );
      } else {
        return ctx.send('❌ Failed to share job link.');
      }
    } catch (error: unknown) {
      console.error(error);
      return ctx.send('❌ An error occurred while sharing the job link.');
    }
  };
}
