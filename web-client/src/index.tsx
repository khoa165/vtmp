import ReactDOM from 'react-dom/client';
import { StatsigProvider } from 'statsig-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { App } from 'src/components/app';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <StatsigProvider
    sdkKey="client-TzqggOpstNL0ZDBaJ6PosFDgphBtztZJjLRcKYl7ep0"
    waitForInitialization={false}
    user={{}}
  >
    <App />
  </StatsigProvider>
);
