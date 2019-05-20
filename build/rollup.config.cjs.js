import base, { banner } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vuejsDatepicker',
    file: 'dist/vuejs-datepicker.common.js',
    format: 'cjs',
    banner: banner,
    globals: {
      'vue': 'Vue'
    }
  }
})

export default config
