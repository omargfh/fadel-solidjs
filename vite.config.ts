import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import solidLabels from 'babel-plugin-solid-labels'
import unoCss from 'unocss/vite'

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
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
