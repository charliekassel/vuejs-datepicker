import fs from 'fs'
import path from 'path'
import { rollup } from 'rollup'
import { uglify } from 'rollup-plugin-uglify'
import chalk from 'chalk'
import babel from 'rollup-plugin-babel'

async function build () {
  console.log(chalk.cyan('Building individual translations.'))
  const files = fs.readdirSync('./src/locale/translations')
  files.forEach(async function (file) {
    const inputOptions = {
      input: path.join(__dirname, '..', 'src', 'locale', 'translations', file),
      plugins: [
        babel({
          extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
          runtimeHelpers: true
        }),
        uglify()
      ]
    }
    const bundle = await rollup(inputOptions)
    const outputOptions = {
      file: path.join(__dirname, '..', 'dist', 'locale', 'translations', file),
      format: 'cjs'
    }
    await bundle.write(outputOptions)
  })
  await console.log(chalk.green('Individual translations built.'))
}

async function buildAll () {
  console.log(chalk.cyan('Building translation importer.'))
  const bundle = await rollup({
    input: path.join(__dirname, '..', 'src', 'locale', 'index.js'),
    plugins: [
      babel({
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
        runtimeHelpers: true
      }),
      uglify()
    ]
  })
  await bundle.write({
    file: path.join(__dirname, '..', 'dist', 'locale', 'index.js'),
    format: 'cjs'
  })
  await console.log(chalk.green('All translations built.'))
}

build()
buildAll()
