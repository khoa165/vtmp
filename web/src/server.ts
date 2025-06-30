import app from '@/app';
import '@/services/link/cron.service';
import { EnvConfig } from '@/config/env';

const PORT = EnvConfig.get().PORT ?? 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
