module.exports = {
  'presets': [
    ['@babel/preset-env']
  ],
  "plugins": [
    ["@babel/transform-runtime"]
  ],
  'env': {
    'test': {
      'plugins': ['@babel/plugin-transform-modules-commonjs',]
    }
  }
}
