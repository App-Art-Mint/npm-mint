import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default defineConfig({
	extends: [
		js.configs.recommended,
		...tseslint.configs.strictTypeChecked,
		...tseslint.configs.stylisticTypeChecked,
	],
	files: ['**/*.{ts,tsx}'],
	ignores: ['dist/**', 'doc/**'],
	languageOptions: {
		ecmaVersion: 2020,
		globals: globals.browser,
		parserOptions: {
			project: [
				'./tsconfig.lib.json',
				'./tsconfig.node.json',
			],
			tsconfigRootDir: (import.meta as ImportMeta & { dirname: string }).dirname,
		},
	},
});
