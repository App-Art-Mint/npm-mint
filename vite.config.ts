import { fileURLToPath, URL } from 'url';
import { extname, relative } from 'path';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const sourceRoot = fileURLToPath(new URL('./src/ts', import.meta.url));

export default defineConfig({
	plugins: [
		dts({
			tsconfigPath: './tsconfig.lib.json',
			entryRoot: sourceRoot,
			beforeWriteFile: (filePath, content) => ({
				filePath: filePath.replace(/[\\/]src[\\/]ts(?=[\\/])/, ''),
				content,
			}),
		})
	],
	resolve: {
		alias: {
			'@': sourceRoot
		},
	},
	build: {
		emptyOutDir: false,
		lib: {
			entry: 'src/ts',
			formats: ['es', 'cjs'],
			name: 'mint',
			fileName: (format) => `index.${format}.js`
		},
		rollupOptions: {
			input: Object.fromEntries(
				glob.sync('src/ts/**/*.{ts,tsx}').map(file => [
					relative(
						'src/ts',
						file.slice(0, file.length - extname(file).length)
					).replace(/\\/g, '/'),
					fileURLToPath(new URL(file, import.meta.url))
				])
			),
			output: {
				exports: 'named',
				entryFileNames: '[name].[format].js'
			},
		},
	},
});
