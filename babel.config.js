module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': {
          'esmodules': true,
        },
      },
    ],
    'vue'
  ],
  'env': {
    'test': {
      'plugins': [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/transform-runtime',
      ],
    },
  },
};
