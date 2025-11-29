import js from '@eslint/js'
import { flatConfigs as importX } from 'eslint-plugin-import-x'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
	// Ignore common output and deps
	{
		ignores: [
			'dist/**',
			'packages/*/dist/**',
			'build/**',
			'coverage/**',
			'node_modules/**',
			'**/*.map',
			'spec/.DS_Store',
			'spec/support/jasmine.json',
		],
	},

	// Core JS recommendations
	js.configs.recommended,

	// Import, Node, Promise best practices
	importX.recommended,
	n.configs['flat/recommended'],
	promise.configs['flat/recommended'],

	// TypeScript (no type-checking required)
	...tseslint.configs.recommended,

	// Disable rules that conflict with Prettier
	prettier,

	// Project-wide defaults
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.browser, ...globals.node },
		},
		linterOptions: {
			reportUnusedDisableDirectives: 'off',
		},
		rules: {
			// Keep stylistic concerns to Prettier
			semi: 'off',

			// Practical defaults
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', ignoreRestSiblings: true },
			],
			'no-console': 'off',

			// Relax a few strict rules for this codebase
			'promise/catch-or-return': 'warn',
			'promise/always-return': 'warn',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},

	// Test files: add Vitest globals if present
	{
		files: ['**/*.test.*', '**/*.spec.*', 'spec/**/*.*'],
		languageOptions: {
			globals: globals.vitest ?? {},
		},
		rules: {
			'n/no-unsupported-features/node-builtins': 'off',
		},
	},

	// Browser-oriented source files: relax Node builtins checks
	{
		files: ['packages/**/*.{js,ts}'],
		rules: {
			'n/no-unsupported-features/node-builtins': 'off',
			'n/no-extraneous-import': 'off',
		},
	},

	// CommonJS helper files
	{
		files: ['**/*.cjs'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},

	// Declaration files often include unused parameter names by design
	{
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'no-unused-vars': 'off',
		},
	},
]
