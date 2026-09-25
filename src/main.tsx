import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource/prompt/400.css';
import '@fontsource/prompt/500.css';
import '@fontsource/prompt/600.css';
import '@fontsource/prompt/700.css';
import App from './app/App';
import { WatcherProvider } from './app/WatcherContext';
import { I18nProvider } from './i18n/I18nContext';
import './styles.css';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <WatcherProvider><App /></WatcherProvider>
    </I18nProvider>
  </React.StrictMode>
);
