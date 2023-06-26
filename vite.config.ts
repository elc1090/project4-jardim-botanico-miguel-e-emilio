import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from "vite-plugin-pwa";

import vuetify from "vite-plugin-vuetify";
import manifest from './manifest.pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vuetify({
      autoImport: true,
      styles: { configFile: 'src/settings.scss' }
    }),
    VitePWA({
      manifest,
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      workbox: {
        sourcemap: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '^': fileURLToPath(new URL('./src/components', import.meta.url)),
      '~': fileURLToPath(new URL('./public', import.meta.url)),
    }
  }
})
