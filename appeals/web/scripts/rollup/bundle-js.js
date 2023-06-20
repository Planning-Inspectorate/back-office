import alias from '@rollup/plugin-alias';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import rollupPluginBeep from '@rollup/plugin-beep';
import rollupPluginCJS from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import rollupPluginReplace from '@rollup/plugin-replace';
import rollupPluginVirtual from '@rollup/plugin-virtual';
import kleur from 'kleur';
import fs from 'node:fs';
import { rollup } from 'rollup';
import iife from 'rollup-plugin-iife';
import { visualizer } from 'rollup-plugin-visualizer';
import config from '../../environment/config.js';
import { getLogger } from './get-logger.js';
import { minifySource } from './minify-js.js';
import { buildVirtualJSON } from './rollup-plugin-virtual-json.js';

const { buildDir, env, bundleAnalyzer, isProduction, isRelease } = config;
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
		env: env || 'dev',
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
			nodeResolve({
				jsnext: true,
				main: true,
				browser: true,
				preferBuiltins: false
			}),
			rollupPluginCJS({}),
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
				exclude: 'node_modules/**'
			}),
			alias({
				entries: {}
			}),
			iife(),
			...(bundleAnalyzer
				? [visualizer({ filename: 'bundle-stats.html', open: true, gzipSize: true })]
				: [])
		],
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
		format: 'es'
	});
	const outputFiles = appGenerated.output.map(({ fileName }) => fileName);

	// Save the "app.js" entrypoint (which has a hashed name) for the all-browser loader code.
	// @ts-expect-error – package type signature is incorrect
	const entrypoints = appGenerated.output.filter(({ isEntry }) => isEntry);

	if (entrypoints.length !== 1) {
		throw new Error(`expected single Rollup entrypoint, was: ${entrypoints.length}`);
	}

	const appPath = appGenerated.output[0].fileName;

	// Write the bundle entrypoint to a known file for NJ to read.
	logger.log(
		`Writing resource JSON file ${kleur.blue('resourceCSS.json')} to ${kleur.blue(
			'.build/resourceJS.json'
		)}`
	);

	if (!fs.existsSync(buildDir)) {
		fs.mkdirSync(buildDir);
	}

	fs.writeFileSync(`${buildDir}/resourceJS.json`, JSON.stringify({ path: `/scripts/${appPath}` }));

	// Compress the generated source here, as we need the final files and hashes for the Service Worker manifest.
	if (isProduction) {
		const ratio = await minifySource(outputFiles, 'src/server/static/scripts');

		logger.log(`Minified site code is ${(ratio * 100).toFixed(2)}% of source`);
	}

	logger.success(`Bundled JS ${kleur.blue(appPath)}, total ${outputFiles.length} files`);
}

await build();
