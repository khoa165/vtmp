import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { App } from 'components/app';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BadMutationError } from 'components/react-workshop/errors/canonical-errors';
import { toast, ToastContainer } from 'react-toastify';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!);

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: Error) => {
      if (error instanceof BadMutationError) {
        console.log('BadMutationError');
        console.log(error.toString());
        toast.error(
          error.userMessage || 'Oops! Something went wrong, please try again.'
        );
      } else {
        console.log('Unknown error');
        console.log(error);
        toast.error('Oops! Something went wrong, please try again.');
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: Error) => {
      if (error instanceof BadMutationError) {
        console.log('BadMutationError');
        console.log(error.toString());
        toast.error(
          error.userMessage || 'Oops! Something went wrong, please try again.'
        );
      } else {
        console.log('Unknown error');
        console.log(error);
        toast.error('Oops! Something went wrong, please try again.');
      }
    },
  }),
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ToastContainer />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
