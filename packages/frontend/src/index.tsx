import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';

import './polyfills';
import App from './components/app';

import { AppProvider } from './store/app.context';
ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('root')
);
