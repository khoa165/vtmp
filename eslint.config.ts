// @ts-check
import boundaries from 'eslint-plugin-boundaries';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { customEslintRules } from './custom-eslint';
import stylistic from '@stylistic/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import sortExports from 'eslint-plugin-sort-exports';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
      boundaries,
      typescriptSortKeys,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            './packages/common/tsconfig.json',
            './packages/server-common/tsconfig.json',
            './packages/mongo/tsconfig.json',
            './web/tsconfig.json',
            './custom-eslint/tsconfig.json',
            './discord-service/tsconfig.json',
            './link-processing-service/tsconfig.json',
            './apps/mongo-migrations/tsconfig.json',
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
  },
  {
    files: ['web-client/**/*.{ts,tsx}'],
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: false,
          rootDir: 'web-client/src',
          prefix: '#vtmp/web-client',
        },
      ],
    },
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
      '@typescript-eslint/no-var-requires': 'error',
      'customEslintRules/no-try-in-controller-or-middleware': 'error',
      'customEslintRules/enforce-uppercase-enum-values': 'error',
      'typescriptSortKeys/string-enum': 'error',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'repositories',
              allow: ['models', 'repositories'],
            },
            {
              from: 'services',
              allow: ['repositories', 'services'],
            },
            {
              from: 'controllers',
              allow: ['services', 'controllers'],
            },
            {
              from: 'routes',
              allow: ['controllers', 'routes'],
            },
          ],
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
      'web/src/app.ts',
      'web/src/routes/index.ts',
      'web/app.test.ts',
      'web-client/**/*',
      'discord-service/**/*',
      'link-processing-service/**/*',
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
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'boundaries/element-types': 'off',
    },
  },
  { ignores: ['cookiecutter/', 'scripts/', '**/*.{js,d.ts,d.tsx}'] }
);
