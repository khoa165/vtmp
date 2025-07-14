// @ts-check
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import sortExports from 'eslint-plugin-sort-exports';
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
      export: sortExports,
      stylistic,
      checkFile,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            './packages/common/tsconfig.json',
            './packages/server-common/tsconfig.json',
            './packages/mongo/tsconfig.json',
            './apps/web/tsconfig.json',
            './custom-eslint/tsconfig.json',
            './apps/discord-service/tsconfig.json',
            './apps/link-processing-service/tsconfig.json',
            './apps/mongo-migrations/tsconfig.json',
          ],
          noWarnOnMultipleProjects: true,
        },
        node: true,
      },
    },
  },
  // Frontend rules - needs to figure out later why this needs separate config
  {
    files: ['apps/web-client/**/*.{ts,tsx}'],
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: false,
          rootDir: 'apps/web-client/src',
          prefix: '#vtmp/web-client',
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './apps/web-client/tsconfig.app.json',
        },
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'customEslintRules/wrapped-handlers-in-router': 'error',
      'stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'import/no-unresolved': 'error',
      'import/no-default-export': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/order': [
        'error',
        {
          groups: ['external', 'builtin', 'parent', 'internal'],
          pathGroups: [
            {
              pattern: '@vtmp/common/**',
              group: 'parent',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: [],
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
      'export/sort-exports': [
        'error',
        {
          sortDir: 'asc',
          ignoreCase: true,
          sortExportKindFirst: 'type',
          pattern: '**/index.ts',
        },
      ],
    },
  },
  {
    files: [
      'apps/web/src/app.ts',
      'apps/web/src/routes/index.ts',
      'apps/web/app.test.ts',
      'apps/web-client/**/*',
      'apps/discord-service/**/*',
      'apps/link-processing-service/**/*',
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
  {
    files: ['**/mongoDB.testutil.ts', '**/mongoID.testutil.ts'],
    rules: {
      'checkFile/filename-naming-convention': 'off',
    },
  },
  { ignores: ['cookiecutter/', 'scripts/', '**/*.{js,d.ts,d.tsx}'] }
);
