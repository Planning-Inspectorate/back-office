import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
	entry: 'apps/web/src/client/app.js',
	dest: 'apps/web/src/server/static/scripts/app.js',
	format: 'iife',
	sourceMap: 'inline',
	plugins: [
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs(),
		babel({
			exclude: 'node_modules/**',
		}),
		uglify(),
	],
};
