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
      return ctx.send('❌ Please provide a valid URL');
    }

    try {
      const response = await postWithAuthRetry('/links', {
        url: parsed_url.data,
      });
      console.log('Reponse object after submit link: ', response);

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
