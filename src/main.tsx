import React from 'react';
import ReactDOM from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource/prompt/400.css';
import '@fontsource/prompt/500.css';
import '@fontsource/prompt/600.css';
import '@fontsource/prompt/700.css';
import App from './app/App';
import { removeNativeServiceWorkers, shouldRegisterServiceWorker } from './platform/runtime';
import { WatcherProvider } from './app/WatcherContext';
import { I18nProvider } from './i18n/I18nContext';
import ErrorBoundary from './shared/ErrorBoundary';
import './styles.css';

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <I18nProvider>
          <WatcherProvider><App /></WatcherProvider>
        </I18nProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

async function startApp() {
  const isNative = Capacitor.isNativePlatform();
  if (shouldRegisterServiceWorker(window.location.protocol, isNative)) {
    registerSW({ immediate: true });
  } else if (isNative) {
    try {
      const wasControlled = await removeNativeServiceWorkers(
        'serviceWorker' in navigator ? navigator.serviceWorker : undefined,
      );
      if (wasControlled) {
        window.location.reload();
        return;
      }
    } catch {
      // Keep the packaged app usable if WebView refuses service-worker cleanup.
    }
  }
  renderApp();
}

void startApp();
