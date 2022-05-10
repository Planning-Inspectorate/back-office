import './lib/get-logger';
import './lib/hash';
import './lib/minify-js';
import './lib/rollup-plugin-virtual-json';

declare module '@pins/rollup' {
	export * from './lib/get-logger';
	export * from './lib/hash';
	export * from './lib/minify-js';
	export * from './lib/rollup-plugin-virtual-json';
}
