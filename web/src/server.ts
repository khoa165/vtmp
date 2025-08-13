import app from '@/app';
import '@/services/link/cron.service';
import { connectRedis, createInterviewInsightIndex } from '@/config/cache';
import { connectDB } from '@/config/database';
import { EnvConfig } from '@/config/env';
import { cronService } from '@/services/interview-insights/cron.service';

const PORT = EnvConfig.get().PORT ?? 8000;

// Connect to database
await connectDB();

// Connect to Redis
await connectRedis();
await createInterviewInsightIndex();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

await cronService.scheduleCronjob();
