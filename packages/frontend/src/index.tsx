import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import './css/index.scss';

import './polyfills';
import App from './components/app';

const queryClient = new QueryClient();

import { AppProvider } from './store/app.context';
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <AppProvider>
      <App />
    </AppProvider>
  </QueryClientProvider>,
  document.getElementById('root')
);
