import app from '@/app';
import '@/services/link/cron.service';
import { connectCache } from '@/config/cache';
import { connectDB } from '@/config/database';
import { EnvConfig } from '@/config/env';

const PORT = EnvConfig.get().PORT ?? 8000;

// Connect to database
await connectDB();

// Connect to Redis
await connectCache();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
