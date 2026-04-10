import tseslintPlugin from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'

export default [
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			globals: {...globals.node},
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tseslintParser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			'@typescript-eslint': tseslintPlugin,
		},
		rules: {
			...tseslintPlugin.configs.recommended.rules,
		},
	},
	{
		files: ['**/*.tsx'],
		plugins: {
			react: pluginReact,
		},
		settings: {
			react: {version: 'detect'},
			jsxRuntime: 'automatic',
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-console': 'warn',
		},
	},
]
