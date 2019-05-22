import base, { banner } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'vuejsDatepicker',
    file: 'dist/vuejs-datepicker.esm.js',
    format: 'es',
    banner: banner,
    globals: {
      'vue': 'Vue'
    }
  },
  external: [
    'moment'
  ]
})

export default config
