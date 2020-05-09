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
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-use-before-define': 'off',
    'no-plusplus': 'off',
    'no-lonely-if': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'linebreak-style': [0, 'error', 'windows'],
    'arrow-body-style': 'warn',
    'no-param-reassign': 'off',
    'operator-linebreak': 'off',
    'no-return-assign': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
