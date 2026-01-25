import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/habit-tracker/',  // already good – matches your repo/subpath

  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      // Recommended for personal apps: auto-update when new version available
      registerType: 'autoUpdate',

      // Helpful during development (localhost testing)
      devOptions: {
        enabled: true,
      },

      // Cache your JS/CSS/HTML/assets for offline use (localStorage already handles data)
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },

      // Auto-generate manifest + register service worker
      manifest: {
        name: 'Habit Tracker',
        short_name: 'Habits',
        description: 'Simple offline habit tracker',
        theme_color: '#4CAF50',  // change to your app's main color
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/habit-tracker/',  // matches your base
        start_url: '.',            // relative to scope
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          // Optional: better Android adaptive icon look
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      // Optional: auto-copy these to dist (add your real files to public/)
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'pwa-*.png',
      ],
    }),
  ],
})