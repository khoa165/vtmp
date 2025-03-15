import app from '@/app';
import { getConfig } from './config/config';

const CONFIG = getConfig();

const PORT: number = CONFIG.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
