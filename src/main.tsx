import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './app/App';
import { WatcherProvider } from './app/WatcherContext';
import './styles.css';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WatcherProvider><App /></WatcherProvider>
  </React.StrictMode>
);
