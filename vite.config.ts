import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// 这是 vite 脚手架的配置文件，整个vue项目是通过vite跑起来的，那么项目跑起来的时候就会自动执行配置文件里的东西
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    // 你目前只是 配置了 ESLint 规则，但 Vite 在 npm run dev 时并不会自动跑 ESLint，除非你显式接入插件。
    eslint({
      include: ['src/**/*.{js,ts,vue}'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
