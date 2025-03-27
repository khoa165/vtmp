import app from '@/app';
import { getConfig } from './config/config';

// const PORT = getConfig().PORT;
const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
