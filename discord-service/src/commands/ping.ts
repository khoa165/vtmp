import { SlashCommand, CommandContext, SlashCreator } from 'slash-create';

export class PingCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'ping',
      description: 'Ping the bot!',
    });
  }

  override run = async (ctx: CommandContext) => {
    return ctx.send({
      content: `Hello, ${ctx.user.username}`,
      ephemeral: true,
    });
  };
}
