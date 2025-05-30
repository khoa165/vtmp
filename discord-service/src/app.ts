import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { SlashCreator, ExpressServer } from 'slash-create';
import { ShareLinkCommand } from '@/commands/share-link';
import { PingCommand } from '@/commands/ping';
import { EnvConfig } from '@/config/env';

const app: Express = express();

app.use(cors());
app.use(helmet()); // Secure HTTP headers
app.use(morgan('dev')); // Logging HTTP requests

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

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Discord service is running');
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('Discord service is healthy');
});

export default app;
