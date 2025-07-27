import app from '@/app';
import '@/services/link/cron.service';
import { connectRedis } from '@/config/cache';
import { connectDB } from '@/config/database';
import { EnvConfig } from '@/config/env';

const PORT = EnvConfig.get().PORT ?? 8000;

// Connect to database
await connectDB();

// Connect to Redis
await connectRedis();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
