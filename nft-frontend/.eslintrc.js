const { resolve } = require('path');

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
    'plugin:react/recommended',
  ],
  plugins: ['import', 'react-hooks', 'prettier'],
  parser: '@typescript-eslint/parser',

  settings: {
    react: {
      version: 'detect',
    },
  },

  env: {
    es6: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: resolve(__dirname, './tsconfig.json'),
  },

  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-function': 'off',
    'no-empty-function': 'off',
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'react/jsx-curly-brace-presence': [1, 'never'],
    'react/forbid-elements': [2, { forbid: [{ element: 'a', message: 'use components/utils/link instead' }] }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-relative-parent-imports': 2,
    'no-magic-numbers': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'prettier/prettier': 'error',
    indent: 0,
  },
};
