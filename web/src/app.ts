import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import morgan from 'morgan';

import { rateLimitMiddleware } from '@/middlewares/rate-limit.middleware';
import { sanitizeMiddileWare } from '@/middlewares/sanitize.middleware';
import { routeErrorHandler } from '@/middlewares/utils';
import routes from '@/routes/index';

dotenv.config();

const app: Express = express();

// Global middlewares
app.use(cors());
app.use(sanitizeMiddileWare());
app.use(xss());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Secure HTTP headers
app.use(morgan('dev')); // Logging HTTP requests
app.use(rateLimitMiddleware());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Server is running');
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('Server is healthy');
});

app.get('/vtmp-summary', (_req: Request, res: Response) => {
  const summaryData = {
    conversations: 1,
    snapInterns: 2,
    months: 3,
    believers: 4,
    reviewedApplications: 204 + 293 + 302,
    interviewedCandidates: 19 + 63 + 40,
    workshops: 21,
    amas: 14,
    groupProjects: 3 + 7,
    leetcodeContests: 16 + 25,
  };
  res.status(200).json(summaryData);
});

// Routes
app.use('/api', routes);
app.use(routeErrorHandler);
app.use('*', (_req: Request, res: Response) => {
  res.status(404).send('Not found');
});

export default app;
