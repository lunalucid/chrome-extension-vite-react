import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: ['build/**', 'node_modules/**', 'eslint.config.js'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        chrome: 'readonly',
        browser: 'readonly',
      },
    },
  },

  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
