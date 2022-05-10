import { buildVirtualJSON, getLogger, minifySource } from '@pins/rollup';
import alias from '@rollup/plugin-alias';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import rollupPluginBeep from '@rollup/plugin-beep';
import rollupPluginCJS from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import rollupPluginReplace from '@rollup/plugin-replace';
import rollupPluginVirtual from '@rollup/plugin-virtual';
import kleur from 'kleur';
import fs from 'node:fs/promises';
import path from 'node:path';
import { rollup } from 'rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import config from '../environment/config.js';

const { NODE_ENV, bundleAnalyzer, isProd: isProduction, isRelease } = config;

const logger = getLogger({ scope: 'JS' });

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
		env: NODE_ENV || 'dev',
		version: `v${new Date().toISOString().replace(/\D/g, '').slice(0, 12)}`
	}
};

/**
 * Performs main site compilation via Rollup.
 */
async function build() {
	const input = 'src/client/app.js';

	logger.log(
		`Bundling (${isProduction ? kleur.magenta('production') : kleur.magenta('development')} / ${
			isRelease ? 'release' : 'dev'
		})`,
		kleur.blue(input)
	);

	const appBundle = await rollup({
		input,
		plugins: [
			nodeResolve(),
			rollupPluginCJS({
				include: ['node_modules/**', /node_modules\/govuk-frontend/]
			}),
			rollupPluginReplace({
				values: {
					__buildEnv__: isProduction ? JSON.stringify('production') : JSON.stringify('development'),
					'process.env.NODE_ENV': isProduction
						? JSON.stringify('production')
						: JSON.stringify('development')
				},
				preventAssignment: true
			}),
			rollupPluginVirtual(buildVirtualJSON(virtualImports)),
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
			...(bundleAnalyzer
				? [
						visualizer({
							filename: 'bundle-stats.html',
							open: true,
							gzipSize: true
						})
					]
				: [])
		],
		manualChunks: () => {},
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

	const appPath = appGenerated.output[0].fileName;

	// Write the bundle entrypoint to a known file for NJ to read.
	logger.log(
		`Writing resource JSON file ${kleur.blue('resourceCSS.json')} to ${kleur.blue(
			'src/server/_data/resourceJS.json'
		)}`
	);
	await fs.writeFile(
		'src/server/_data/resourceJS.json',
		JSON.stringify({ path: `/scripts/${appPath}` })
	);

	// Compress the generated source here, as we need the final files and hashes for the Service Worker manifest.
	if (isProduction) {
		const ratio = await minifySource(outputFiles, 'src/server/static/scripts');

		logger.log(`Minified site code is ${(ratio * 100).toFixed(2)}% of source`);
	}

	logger.success(`Bundled JS ${kleur.blue(appPath)}, total ${outputFiles.length} files`);
}

await build();
