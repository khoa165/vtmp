import 'module-alias/register';
import app from '@/app';

const PORT: string | number = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
