import path from 'path'
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'

import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import common from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import node from 'rollup-plugin-node-resolve'
import css from 'rollup-plugin-css-only'
import CleanCSS from 'clean-css'

import fs from 'fs'

const version = require('../package.json').version
export const banner =
  '/*!\n' +
  ' * vuejs-datepicker v' + version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' Charlie Kassel\n' +
  ' * Released under the MIT License.\n' +
  ' */'

export default {
  input: path.join(__dirname, '..', 'src', 'components', 'Datepicker.vue'),
  plugins: [
    node({
      extensions: ['.js', '.jsx', '.vue']
    }),
    common(),
    css({ output: (style) => {
      fs.writeFileSync('dist/vuejs-datepicker.css', new CleanCSS().minify(style).styles)
    }
    }),
    vue({
      css: false,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    postcss({
      plugins: [
        autoprefixer()
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue']
    })
  ]
}
