// import js from '@eslint/js';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';
// import pluginReact from 'eslint-plugin-react';
// import { defineConfig } from 'eslint/config';
// import rulesCustom from './custom-eslint/index.ts';

// export default defineConfig([
//   {
//     files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
//     languageOptions: {
//       parser: tseslint.parser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//       },
//       globals: globals.browser,
//     },
//     plugins: {
//       js,
//       custom: rulesCustom,
//       react: pluginReact,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...tseslint.configs.recommended.rules,
//       ...pluginReact.configs.flat.recommended.rules,
//       'custom/no-require-function-calls': 'error',
//     },
//     settings: {
//       react: {
//         version: 'detect',
//       },
//     },
//   },
// ]);

// @ts-check
// import globals from 'globals';
// import tseslint from 'typescript-eslint';

// // ✅ Import your compiled rule
// // import customEslintRules from './custom-eslint/dist/index.js';

// export default tseslint.config(
//   ...tseslint.configs.recommended, // ✅ TS recommended rules
//   {
//     languageOptions: {
//       parser: tseslint.parser,
//       globals: {
//         ...globals.node,
//         ...globals.browser,
//       },
//     },
//     plugins: {
//       // customEslintRules, // ✅ Register your plugin
//     },
//     rules: {
//       // ✅ Enable your custom rule only
//       'customEslintRules/no-require-function-calls': 'error',
//     },
//   },
// );
