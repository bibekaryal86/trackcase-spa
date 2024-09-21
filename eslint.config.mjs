import typescriptEslint from '@typescript-eslint/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import eslint from '@eslint/js'
import eslintPluginImportX from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier'

export default [
  eslint.configs.recommended,
  typescriptEslint.configs.recommended,
  reactHooks.configs.recommended,
  eslintPluginImportX.configs.recommended,
  eslintPluginImportX.configs.typescript,
  {
    ignores: [
      '**/*.snap',
      '**/webpack.dev.config.js',
      '**/webpack.prod.config.js',
      '**/jest.setup.js',
      '**/jest.config.js',
      '**/variables.env',
      '**/node_modules/',
      '**/build/',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        document: 'readonly',
      },
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
    plugins: {
      'prettier': prettier,
      'react': react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'off',
    },
  },
]