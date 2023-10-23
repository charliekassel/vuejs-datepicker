import {resolve} from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: '@tunezilla/vuejs-datepicker',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
})
