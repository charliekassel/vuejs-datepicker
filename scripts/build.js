import path from 'path'
import {terser} from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import commonjs from 'rollup-plugin-commonjs'

export default [{
  input: path.join(__dirname, '..', 'src', 'components', 'Datepicker.vue'),
  output: [
    {
      file: 'dist/vuejs-datepicker.js',
      format: 'umd',
      name: 'vuejsDatepicker'
    },
    {
      file: 'dist/vuejs-datepicker.common.js',
      format: 'cjs'
    },
    {
      file: 'dist/vuejs-datepicker.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    vue({css: true}),
    postcss({plugins: [autoprefixer()]}),
    commonjs(),
    babel({exclude: 'node_modules/**'})
  ]
}, {
  input: path.join(__dirname, '..', 'src', 'components', 'Datepicker.vue'),
  output: {
    file: 'dist/vuejs-datepicker.min.js',
    format: 'umd',
    name: 'vuejsDatepicker'
  },
  plugins: [
    vue({css: true}),
    postcss({plugins: [autoprefixer()]}),
    commonjs(),
    terser(),
    babel({exclude: 'node_modules/**'})
  ]
}]
