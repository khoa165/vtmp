import app from '@/app';
import { getConfig } from './config/config';

app.listen(getConfig().PORT, () => { ... });
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
