import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Artuphay Gabut di Pos Indonesia',
        short_name: 'PosIND Idle',
        description: 'Simulasi Karir Pegawai PosIND',
        theme_color: '#0A0F1D',
        background_color: '#0A0F1D',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://raw.githubusercontent.com/vitejs/vite/main/docs/public/logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'https://raw.githubusercontent.com/vitejs/vite/main/docs/public/logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});