import {resolve} from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'vuejsDatepicker',
      fileName: 'vuejs-datepicker'
    }
  },
  rollupOptions: {
    external: ['vue'],
    output: {
      globals: {
        vue: 'Vue'
      }
    }
  }
})
