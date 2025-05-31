import {
  SlashCommand,
  CommandContext,
  SlashCreator,
  CommandOptionType,
} from 'slash-create';
import { z } from 'zod';
import { postWithAuthRetry } from '@/utils/auth';

const urlSchema = z.string().url();

export class ShareLinkCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'share-link',
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
      return ctx.send({
        content: '❌ Please provide a valid URL',
        ephemeral: true,
      });
    }

    try {
      const response = await postWithAuthRetry('/links', {
        url: parsed_url.data,
      });
      console.log('Reponse object after submit link: ', response);

      if (response.status === 201) {
        return ctx.send({
          content: `✅ Job link shared successfully!\n[View job posting](${parsed_url.data})`,
        });
      } else {
        return ctx.send({
          content: '❌ Failed to share job link.',
          ephemeral: true,
        });
      }
    } catch (error: unknown) {
      console.error(error);
      return ctx.send({
        content: '❌ An error occurred while sharing the job link.',
        ephemeral: true,
      });
    }
  };
}
