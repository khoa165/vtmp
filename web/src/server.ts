import app from '@/app';
import { getConfig } from './config/config';

const PORT = getConfig().PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
