import customRule from './Eslint-rules/no-model-import-outside-repo.js';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['local'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    'local/no-model-import-outside-repo': 'error',
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js'],

  // 👇 register your custom rule manually
  ...localPlugin,
};