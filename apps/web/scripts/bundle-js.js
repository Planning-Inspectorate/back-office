'use strict';

const fs = require('node:fs').promises;
const path = require('node:path');
const rollup = require('rollup');
const alias = require('@rollup/plugin-alias');
const rollupPluginNodeResolve = require('@rollup/plugin-node-resolve').default;
const rollupPluginCJS = require('@rollup/plugin-commonjs');
const rollupPluginVirtual = require('@rollup/plugin-virtual');
const rollupPluginReplace = require('@rollup/plugin-replace');
const rollupPluginBeep = require('@rollup/plugin-beep');
const rollupSizePlugin = require('rollup-plugin-size');
const { visualizer } = require('rollup-plugin-visualizer');
const { getBabelOutputPlugin } = require('@rollup/plugin-babel');
const getLogger = require('../lib/get-logger');
const { minifySource } = require('../lib/minify-js');
const { hashForFiles } = require('../lib/hash');
const { notify } = require('../lib/notifier');
const { buildVirtualJSON } = require('../lib/rollup-plugin-virtual-json');
const { loadEnvironment } = require('../lib/load-environment');

loadEnvironment(process.env.NODE_ENV);

const isProduction = process.env.ELEVENTY_ENV === 'prod';
const isRelease = process.env.APP_RELEASE === 'true';
const appDirectory = fs.realpathSync(process.cwd());
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
		env: process.env.ELEVENTY_ENV || 'dev',
		useMockApi: process.env.USE_MOCK_API === 'true',
		version: 'v' + new Date().toISOString().replace(/[\D]/g, '').slice(0, 12)
	}
};

/**
 * Performs main site compilation via Rollup.
 */
async function build() {
	const appBundle = await rollup.rollup({
		input: 'src/client/app.js',
		plugins: [
			rollupPluginNodeResolve(),
			rollupPluginCJS({
				include: 'node_modules/**'
			}),
			rollupPluginReplace({
				__buildEnv__: isProduction ? JSON.stringify('production') : JSON.stringify('development'),
				'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development')
			}),
			rollupPluginVirtual(buildVirtualJSON(virtualImports)),
			rollupSizePlugin(),
			rollupPluginBeep(),
			getBabelOutputPlugin({
				// babelHelpers: 'bundled',
				// exclude: 'node_modules/**',
				allowAllFormats: true,
				configFile: path.resolve(appDirectory, 'babel.config.js')
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
		entryFileNames: '[name]-[hash].js',
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

	const hash = hashForFiles(path.join('src/server/static/scripts', bootstrapPath));
	const resourceName = `${bootstrapPath}?v=${hash}`;

	// Write the bundle entrypoint to a known file for Eleventy to read.
	await fs.writeFile('src/server/_data/resourceJS.json', JSON.stringify({ path: `/scripts/${resourceName}` }));

	// Compress the generated source here, as we need the final files and hashes for the Service Worker manifest.
	if (isProduction) {
		const ratio = await minifySource(outputFiles);
		logger.log(`Minified site code is ${(ratio * 100).toFixed(2)}% of source`);
	}

	logger.log(`Built site JS! '${resourceName}', total ${outputFiles.length} files`);
}

(async function () {
	await build();

	notify('Compiled client files');
})();
