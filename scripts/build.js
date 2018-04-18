import path from 'path'
import uglify from 'rollup-plugin-uglify'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import {rollup} from 'rollup'
import chalk from 'chalk'

const version = require('../package.json').version
const banner =
  '/*!\n' +
  ' * vuejs-datepicker v' + version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' Charlie Kassel\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const configs = {
  umd: {
    output: 'vuejs-datepicker.js',
    format: 'umd'
  },
  umdMin: {
    output: 'vuejs-datepicker.min.js',
    format: 'umd',
    plugins: [uglify()]
  },
  cjs: {
    output: 'vuejs-datepicker.common.js',
    format: 'cjs'
  },
  esm: {
    output: 'vuejs-datepicker.esm.js',
    format: 'es'
  }
}

async function build () {
  Object.keys(configs).forEach(async function (key) {
    const config = configs[key]
    console.log(chalk.cyan(`Building ${key}: ${config.output}`))
    const inputOptions = {
      input: path.join(__dirname, '..', 'src', 'components', 'Datepicker.vue'),
      plugins: [
        vue({
          css: true
        }),
        postcss({
          plugins: [
            autoprefixer()
          ]
        }),
        buble()
      ].concat(config.plugins || [])
    }
    const bundle = await rollup(inputOptions)
    const outputOptions = {
      file: path.join(__dirname, '..', 'dist', config.output),
      format: config.format,
      banner: banner,
      name: 'vuejs-datepicker'
    }
    await bundle.write(outputOptions)
  })
  await console.log(chalk.green('All modules built'))
}

build()
