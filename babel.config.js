module.exports = {
  'presets': [
    ['@babel/preset-env', {
      'modules': false
    }]
  ],
  'env': {
    'test': {
      'plugins': ['@babel/plugin-transform-modules-commonjs']
    }
  }
}
