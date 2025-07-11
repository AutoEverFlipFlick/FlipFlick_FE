// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import storybook from 'eslint-plugin-storybook';
import prettier from 'eslint-config-prettier';
import { configConventional } from '@commitlint/config-conventional';

export default [
  js.configs.recommended,

  {
    extends: [configConventional],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      storybook,
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...storybook.configs['flat/recommended'].rules,
      'react/react-in-jsx-scope': 'off',
    },
  },

  prettier,
];
