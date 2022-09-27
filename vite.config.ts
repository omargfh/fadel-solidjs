import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import solidLabels from 'babel-plugin-solid-labels'
import unoCss from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'

//@ts-ignore
const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  plugins: [
    solidPlugin({
      babel: {
        plugins: [[solidLabels, { dev: isDev }]],
      },
    }),
    unoCss(),
    VitePWA({
      injectRegister: 'inline',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: isDev,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Fadel',
        short_name: 'Fadel',
        description: 'Compare Multiple Images.',
        theme_color: '#151518',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
