// @ts-check
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { customPlugin } from './custom-eslint';

export default tseslint.config(
  eslint.configs.recommended, /// recommended Eslint rules
  ...tseslint.configs.recommended, /// recommended rules for TypeScript
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parser: tseslint.parser,
    },
    plugins: {
      customPlugin,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'customPlugin/explicit-generics': ['error', { functionNames: ['post'] }],
      'customPlugin/lowercase-function': 'error',
      'curly': 'error',
    },
  },
  { ignores: ['cookiecutter/', 'scripts/'] }
);
