import fs from 'fs'
import path from 'path'
import {terser} from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const files = fs.readdirSync('./src/locale/translations')
const config = files.map(file => {
  return {
    input: path.join(__dirname, '..', 'src', 'locale', 'translations', file),
    output: {
      file: path.join(__dirname, '..', 'dist', 'locale', 'translations', file),
      format: 'umd',
      name: `vdp_translation_${file}`
    },
    plugins: [
      commonjs(),
      babel({exclude: 'node_modules/**'}),
      terser()
    ]
  }
})

export default config
