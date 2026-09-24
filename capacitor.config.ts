import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lnwjud.watcher',
  appName: 'LNWJUD Watcher',
  webDir: 'dist',
  server: { androidScheme: 'https' }
};

export default config;
