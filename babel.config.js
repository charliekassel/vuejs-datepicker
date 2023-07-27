module.exports = {
  'presets': [
    ['@babel/preset-env', {
      'modules': false,
      targets: {
        node: 'current',
      },
    }]
  ],
  'env': {
    'test': {
      'plugins': ['@babel/plugin-transform-modules-commonjs']
    }
  }
}
