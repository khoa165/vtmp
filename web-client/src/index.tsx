import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { StatsigProvider } from 'statsig-react';

import { App } from '#vtmp/web-client/components/app';
import { EnvConfig } from '#vtmp/web-client/config/env';

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <StatsigProvider
    sdkKey={EnvConfig.get().VITE_STATSIG_CLIENT_SDK_KEY}
    waitForInitialization={false}
    user={{}}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StatsigProvider>
);
