import express, { Express } from 'express';
import { SlashCreator, ExpressServer } from 'slash-create';
import { PingCommand, ShareLinkCommand } from '@/commands';
import { EnvConfig } from '@/config/env';

const app: Express = express();

app.use(express.json());

const creator = new SlashCreator({
  applicationID: EnvConfig.get().DISCORD_APPLICATION_ID,
  publicKey: EnvConfig.get().DISCORD_PUBLIC_KEY,
  token: EnvConfig.get().DISCORD_BOT_TOKEN,
});

creator.withServer(new ExpressServer(app));

creator.registerCommands([
  new PingCommand(creator),
  new ShareLinkCommand(creator),
]);

creator.syncCommands();

export default app;
