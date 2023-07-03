import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { AppProvider } from './store/app.context';
import App from './components/app';

import './css/index.scss';
import { createRoot } from 'react-dom/client';


const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
        <AppProvider>
          <App />
        </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
