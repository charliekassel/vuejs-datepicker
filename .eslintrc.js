module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'eslint-config-standard',
    'plugin:vue/vue3-essential',
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
