import base, { banner } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vuejsDatepicker',
    file: 'dist/vuejs-datepicker.umd.js',
    format: 'umd',
    banner: banner,
    globals: {
      'vue': 'Vue'
    }
  }
})

export default config
