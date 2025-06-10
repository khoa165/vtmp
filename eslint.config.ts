// @ts-check
import boundaries from 'eslint-plugin-boundaries';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { rulesCustom } from './custom-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Optionally add strict/stylistic rules if needed
  // tseslint.configs.strict,
  // tseslint.configs.stylistic,

  {
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
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
          type: 'routes',
          pattern: 'routes/*.ts',
          mode: 'file',
          capture: ['elementName'],
        },
        {
          type: 'controllers',
          pattern: 'controllers/*.ts',
          mode: 'file',
          capture: ['elementName'],
        },
        {
          type: 'services',
          pattern: 'services/*.ts',
          mode: 'file',
          capture: ['elementName'],
        },
        {
          type: 'repositories',
          pattern: 'repositories/*.ts',
          mode: 'file',
          capture: ['elementName'],
        },
        {
          type: 'models',
          pattern: 'models/*.ts',
          mode: 'file',
          capture: ['elementName'],
        },
      ],
    },
    rules: {
      // Custom rule
      'custom/no-try-in-controller-or-middleware': 'error',
      'custom/enforce-uppercase-enum-values': 'error',
      'custom/enforce-sorted-enum-keys': 'error',
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

  // Ignore files
  {
    ignores: ['dist/', 'node_modules/'],
  }
);
