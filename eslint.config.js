// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import storybook from 'eslint-plugin-storybook'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,

  {
    ignores: ['commitlint.config.cjs'],
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
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json', // tsconfig
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...storybook.configs['flat/recommended'].rules,
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },

  prettier,
]
