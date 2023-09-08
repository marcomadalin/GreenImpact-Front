module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'vue/component-definition-name-casing': 'off',
    'vue/multi-word-component-names': 'off',
    'no-console': 'off',
  },
}
