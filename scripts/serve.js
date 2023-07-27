import path from 'path'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import common from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'

export default {
  input: path.join(__dirname, '..', 'example', 'main.js'),
  output: {
    file: path.join(__dirname, '..', 'example', 'demo.js'),
    format: 'iife',
    name: 'demo',
    sourcemap: true
  },
  plugins: [
    vue({
      css: true
    }),
    postcss({plugins: [autoprefixer()]}),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    resolve({
      mainFields: ['module', 'main']
    }),
    common(),
    babel({exclude: 'node_modules/**'}),
    serve({
      open: true,
      contentBase: path.join(__dirname, '..', 'example'),
      host: '0.0.0.0',
      port: 3000
    }),
    livereload({
      verbose: true,
      watch: path.join(__dirname, '..', 'example')
    })
  ]
}
