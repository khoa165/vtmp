// @ts-check
import boundaries from 'eslint-plugin-boundaries';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

import { rulesCustom } from './custom-eslint';
import { Linter } from 'eslint';

const sanitizedGlobals: Linter.Globals = Object.fromEntries(
  Object.entries({ ...globals.browser, ...globals.node }).map(([key, value ]) => [
    key.trim(),
    value,
  ])
);

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Optionally add strict/stylistic rules if needed
  // tseslint.configs.strict,
  // tseslint.configs.stylistic,

  {
    languageOptions: {
      parser: tseslint.parser,
      globals: sanitizedGlobals,
    },
    plugins: {
      boundaries,
      custom: rulesCustom,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            './web/tsconfig.json',
            './packages/common/tsconfig.json',
            './custom-eslint/tsconfig.json',
            './discord-service/tsconfig.json',
          ],
          noWarnOnMultipleProjects: true,
        },
        node: true,
      },
      react: {
        version: 'detect',
      },
      'boundaries/elements': [
        {
          type: 'helpers',
          pattern: 'helpers/*/*.js',
          mode: 'file',
          capture: ['category', 'elementName'],
        },
        {
          type: 'components',
          pattern: 'components/*/*',
          capture: ['family', 'elementName'],
        },
        {
          type: 'modules',
          pattern: 'module/*',
          capture: ['elementName'],
        },
      ],
    },
    rules: {
      // Custom rule
      'custom/no-try-in-controller-or-middleware': 'error',
      'custom/enforce-uppercase-enum-values': 'error',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'repositories',
              allow: ['models'],
            },
            {
              from: 'services',
              allow: ['repositories'],
            },
            {
              from: 'controllers',
              allow: ['services'],
            },
            {
              from: 'routes',
              allow: ['controllers'],
            },
          ],
        },
      ],
    },
  },

  // Optional override example (can be extended as needed)
  // Ignore files
  {
    ignores: ['dist/', 'node_modules/'],
  }
);
