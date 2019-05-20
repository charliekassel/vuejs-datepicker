import base, { banner } from './rollup.config.base'
import { uglify } from 'rollup-plugin-uglify'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vuejsDatepicker',
    file: 'dist/vuejs-datepicker.min.js',
    banner: banner,
    format: 'iife',
    globals: {
      'vue': 'Vue'
    }
  }
})

config.plugins.push(uglify())

export default config
