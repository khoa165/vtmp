import app from '@/app';
import { EnvConfig } from '@/config/env';

const PORT = EnvConfig.get().PORT || 80;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
