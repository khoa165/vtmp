import { EnvConfig } from '@/config/env';

export const helloPort = () => {
  const CONFIG = EnvConfig.get();
  const port = CONFIG.PORT;
  return `hello ${port}`;
};
