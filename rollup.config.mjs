import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import iife from "rollup-plugin-iife";

export default {
	input: 'apps/web/src/client/app.js',
	output: {
		format: 'es',
		name: 'app',
		dir: 'apps/web/src/server/static/scripts'
	},
	sourceMap: 'inline',
	plugins: [
		resolve({
			jsnext: true,
			main: true,
			browser: true,
			preferBuiltins: false
		}),
		commonjs(),
		babel({
			exclude: 'node_modules/**',
		}),
		iife()
	],
};
