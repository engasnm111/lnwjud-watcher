import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'brand/lnwjud-watcher-logo-dark.png',
        'brand/lnwjud-watcher-logo-transparent.png',
        'brand/lnwjud-watcher-mark.png',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'LNWJUD Watcher',
        short_name: 'Watcher',
        description: 'Read-only live monitoring for LNWJUD runtimes',
        theme_color: '#070b12',
        background_color: '#070b12',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
});
