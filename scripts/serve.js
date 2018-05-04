import path from 'path'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import common from 'rollup-plugin-commonjs'

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
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    resolve({
      module: true,
      jsnext: true,
      browser: true
    }),
    common(),
    buble({
      objectAssign: 'Object.assign'
    }),
    serve({
      contentBase: path.join(__dirname, '..', 'example'),
      host: 'localhost',
      port: 10001
    }),
    livereload({
      verbose: true,
      watch: path.join(__dirname, '..', 'example')
    })
  ]
}
