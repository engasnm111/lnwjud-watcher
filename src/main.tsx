import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource/prompt/400.css';
import '@fontsource/prompt/500.css';
import '@fontsource/prompt/600.css';
import '@fontsource/prompt/700.css';
import App from './app/App';
import { shouldRegisterServiceWorker } from './platform/runtime';
import { WatcherProvider } from './app/WatcherContext';
import { I18nProvider } from './i18n/I18nContext';
import './styles.css';

if (shouldRegisterServiceWorker(window.location.protocol)) {
  registerSW({ immediate: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <WatcherProvider><App /></WatcherProvider>
    </I18nProvider>
  </React.StrictMode>
);
