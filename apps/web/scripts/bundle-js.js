import * as fs from 'fs/promises';
import path from 'path';
import kleur from 'kleur';
import { rollup } from 'rollup';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import rollupPluginCJS from '@rollup/plugin-commonjs';
import rollupPluginVirtual from '@rollup/plugin-virtual';
import rollupPluginReplace from '@rollup/plugin-replace';
import rollupPluginBeep from '@rollup/plugin-beep';
import rollupSizePlugin from 'rollup-plugin-size';
import { visualizer } from 'rollup-plugin-visualizer';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { loadEnvironment } from 'planning-inspectorate-libs';
import getLogger from '../lib/get-logger.js';
import { minifySource } from '../lib/minify-js.js';
import { hashForFiles } from '../lib/hash.js';
import { notify } from '../lib/notifier.js';
import { buildVirtualJSON } from '../lib/rollup-plugin-virtual-json.js';

loadEnvironment(process.env.NODE_ENV);

const isProduction = process.env.NODE_ENV === 'production';
const isRelease = process.env.APP_RELEASE === 'true';
const logger = getLogger({ scope: 'JS'});

process.on('unhandledRejection', (reason, p) => {
	logger.error('Build had unhandled rejection', reason, p);
	throw new Error(`Build had unhandled rejection ${reason}`);
});

/**
 * Virtual imports made available to all bundles. Used for site config and globals.
 */
const virtualImports = {
	pi_config: {
		isProduction,
		env: process.env.NODE_ENV || 'dev',
		useMockApi: process.env.USE_MOCK_API === 'true',
		version: 'v' + new Date().toISOString().replace(/[\D]/g, '').slice(0, 12)
	}
};

/**
 * Performs main site compilation via Rollup.
 */
async function build() {
	const input = 'src/client/app.js';

	// eslint-disable-next-line max-len
	logger.log(`Bundling (${isProduction ? kleur.magenta('production') : kleur.magenta('development')} / ${isRelease ? 'release' : 'dev'})`, kleur.blue(input));

	const appBundle = await rollup({
		input: input,
		plugins: [
			nodeResolve(),
			rollupPluginCJS({
				include: 'node_modules/**'
			}),
			rollupPluginReplace({
				values: {
					__buildEnv__: isProduction ? JSON.stringify('production') : JSON.stringify('development'),
					'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development')
				},
				preventAssignment: true
			}),
			rollupPluginVirtual(buildVirtualJSON(virtualImports)),
			rollupSizePlugin(),
			rollupPluginBeep(),
			getBabelOutputPlugin({
				// babelHelpers: 'bundled',
				// exclude: 'node_modules/**',
				allowAllFormats: true,
				configFile: path.resolve(process.cwd(), 'babel.config.js')
			}),
			alias({
				entries: {}
			}),
			...(process.env.BUNDLE_ANALYZER === 'true' ? [visualizer({
				filename: 'bundle-stats.html',
				open: true,
				gzipSize: true
			})] : [])
		],
		manualChunks: (id) => {},
		// Controls if Rollup tries to ensure that entry chunks have the same exports as the underlying entry module.
		// https://rollupjs.org/guide/en/#preserveentrysignatures
		preserveEntrySignatures: false
	});
	const appGenerated = await appBundle.write({
		// Do we need an import polyfill?
		// dynamicImportFunction: 'window._import',
		entryFileNames: isRelease ? '[name]-[hash].js' : '[name].js',
		sourcemap: true,
		dir: 'src/server/static/scripts',
		// https://rollupjs.org/guide/en/#outputformat
		format: 'esm',
		generatedCode: {
			preset: 'es2015'
		}
	});
	const outputFiles = appGenerated.output.map(({ fileName }) => fileName);

	// Save the "app.js" entrypoint (which has a hashed name) for the all-browser loader code.
	const entrypoints = appGenerated.output.filter(({ isEntry }) => isEntry);
	if (entrypoints.length !== 1) {
		throw new Error(`expected single Rollup entrypoint, was: ${entrypoints.length}`);
	}

	const bootstrapPath = appGenerated.output[0].fileName;

	const hash = isRelease ? '' : hashForFiles(path.join('src/server/static/scripts', bootstrapPath));
	const resourceName = `${bootstrapPath}${isRelease ? '' : '?v=' + hash}`;

	// Write the bundle entrypoint to a known file for NJ to read.
	logger.log(`Writing resource JSON file ${kleur.blue('resourceCSS.json')} to ${kleur.blue('src/server/_data/resourceJS.json')}`);
	await fs.writeFile('src/server/_data/resourceJS.json', JSON.stringify({ path: `/scripts/${resourceName}` }));

	// Compress the generated source here, as we need the final files and hashes for the Service Worker manifest.
	if (isProduction) {
		const ratio = await minifySource(outputFiles, 'src/server/static/scripts');
		logger.log(`Minified site code is ${(ratio * 100).toFixed(2)}% of source`);
	}

	logger.success(`Bundled JS ${kleur.blue(resourceName)}, total ${outputFiles.length} files`);
}

(async function () {
	await build();

	notify('Compiled client files');
})();
