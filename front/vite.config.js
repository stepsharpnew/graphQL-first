import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Пример: перенаправить API-запросы
      '/api': {
        // target: 'http://backend:3000',
         target : 'http://localhost:3000',
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
})
