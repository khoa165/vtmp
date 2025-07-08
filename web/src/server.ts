import app from '@/app';
import '@/services/link/cron.service';
import { connectDB } from '@/config/database';
import { EnvConfig } from '@/config/env';

const PORT = EnvConfig.get().PORT ?? 8000;

// Connect to database
await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
