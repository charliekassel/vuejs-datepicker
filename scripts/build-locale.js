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
      name: `locale-${file}`
    },
    plugins: [
      commonjs(),
      babel({exclude: 'node_modules/**'}),
      terser()
    ]
  }
})

export default config

// async function buildAll () {
//   console.log(chalk.cyan('Building translation importer.'))
//   const bundle = await rollup({
//     input: path.join(__dirname, '..', 'src', 'locale', 'index.js'),
//     plugins: [
//       buble(),
//       uglify()
//     ]
//   })
//   await bundle.write({
//     file: path.join(__dirname, '..', 'dist', 'locale', 'index.js'),
//     format: 'es'
//   })
//   await console.log(chalk.green('All translations built.'))
// }

// build()
// buildAll()
