module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-use-before-define': 'off',
    'no-plusplus': 'off',
    'no-lonely-if': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'linebreak-style': [0, 'error', 'windows'],
    'arrow-body-style': 'warn',
    'no-param-reassign': 'off',
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
