import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '@/config/database';
import routes from '@/routes/index';

dotenv.config();

const app: Express = express();

// Connect to database
connectDB();

// Global middlewares
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(morgan('dev')); // Logging HTTP requests

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('Server is running');
});

// Routes
// app.use('/api', routes);

export default app;
