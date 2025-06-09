// @ts-check
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { customEslintRules } from './custom-eslint';

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
      customEslintRules,
      import: importPlugin,
      stylistic,
      checkFile,
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
    },
  },
  // Frontend rules - needs to figure out later why this needs separate config
  {
    files: ['web-client/**/*.{ts,tsx}'],
    settings: {
      'import/resolver': {
        typescript: {
          project: './web-client/tsconfig.app.json',
        },
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'off',
      'customEslintRules/wrapped-handlers-in-router': 'error',
      'stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'import/no-unresolved': 'error',
      'import/no-default-export': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/order': [
        'error',
        {
          groups: ['external', 'builtin', 'internal'],
          pathGroups: [
            {
              pattern: '@vtmp/common/**',
              group: 'internal',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      'checkFile/filename-naming-convention': [
        'error',
        {
          '**/stories/**/*.{ts,tsx}': 'PASCAL_CASE',
          '**/hooks/**/(use*).{ts,tsx}': 'CAMEL_CASE',
          '**/!(stories|hooks)/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  {
    files: [
      'web/src/app.ts',
      'web/src/routes/index.ts',
      'web/app.test.ts',
      'web-client/**/*',
      'discord-service/**/*',
    ],
    rules: {
      'customEslintRules/wrapped-handlers-in-router': 'off',
    },
  },
  {
    files: [
      '**/{app,index,main}.{ts,tsx}',
      'eslint.config.ts',
      '**/vite.config.ts',
      '**/.storybook/**/*',
      '**/*.stories.{ts,tsx}',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  { ignores: ['cookiecutter/', 'scripts/', '**/*.{js,d.ts,d.tsx}'] }
);
