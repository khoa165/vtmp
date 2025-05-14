// @ts-check
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended, /// recommended Eslint rules
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parser: tseslint.parser,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
  { ignores: ['cookiecutter/', 'scripts/'] }
);
