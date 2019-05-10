import fs from 'fs'
import path from 'path'
import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

const translationRollups = []

const plugins = [
  babel(),
  uglify()
]

const files = fs.readdirSync('./src/locale/translations')
files.forEach((file) => {
  translationRollups.push({
    input: path.join(__dirname, '..', 'src', 'locale', 'translations', file),
    plugins,
    output: {
      file: path.join(__dirname, '..', 'dist', 'locale', 'translations', file),
      format: 'cjs'
    }
  })
})

translationRollups.push({
  input: path.join(__dirname, '..', 'src', 'locale', 'index.js'),
  plugins,
  output: {
    file: path.join(__dirname, '..', 'dist', 'locale', 'index.js'),
    format: 'cjs'
  }
})

export default translationRollups
