import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/manifest.json',
          dest: '.',
        },
        {
          src: 'src/Extension/app/service_worker.js',
          dest: '.',
        },
        {
          src: 'src/Extension/assets/icons',
          dest: './assets'
        }
      ],
    })
  ]
})
