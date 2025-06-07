import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

import { rulesCustom } from './custom-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Optionally add strict/stylistic rules if needed
  // tseslint.configs.strict,
  // tseslint.configs.stylistic,

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    plugins: {
      custom: rulesCustom,
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Combine recommended rules
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      ...pluginReact.configs.flat.recommended.rules,

      // Custom rule
      'custom/no-require-function-calls': 'error',
    },
  },

  // Optional override example (can be extended as needed)
  {
    files: ['**/{app,index,main}.{ts,tsx}', 'eslint.config.ts'],
    rules: {
      'react/react-in-jsx-scope': 'off', // example override
    },
  },

  // Ignore files
  {
    ignores: ['dist/', 'node_modules/'],
  }
);
