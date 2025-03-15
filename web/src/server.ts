import app from '@/app';
import { getConfig } from './config/config';

const CONFIG = getConfig();

const PORT: string | number = CONFIG.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
