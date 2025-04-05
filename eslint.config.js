// @ts-check
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
  { ignores: ['cookiecutter/', 'scripts/'] },
  {
    files: ['*.test.js'],
    rules: {
      'no-unused-expressions': 'off',
    },
  }
);
