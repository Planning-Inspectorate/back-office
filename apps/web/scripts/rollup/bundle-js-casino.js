import alias from '@rollup/plugin-alias';
import {babel} from '@rollup/plugin-babel';
import rollupPluginBeep from '@rollup/plugin-beep';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import rollupPluginReplace from '@rollup/plugin-replace';
import rollupPluginVirtual from '@rollup/plugin-virtual';
import kleur from 'kleur';
import fs from 'node:fs';
import path from 'node:path';
import {rollup} from 'rollup';
import {visualizer} from 'rollup-plugin-visualizer';
import config from '../../environment/config.js';
import {getLogger} from './get-logger.js';
import {minifySource} from './minify-js.js';
import {buildVirtualJSON} from './rollup-plugin-virtual-json.js';

const {buildDir, env, bundleAnalyzer, isProduction, isRelease} = config;
const logger = getLogger({scope: 'JS'});
/*

process.on('unhandledRejection', (reason, p) => {
	logger.error('Build had unhandled rejection', reason, p);
	throw new Error(`Build had unhandled rejection ${reason}`);
});

/!**
 * Virtual imports made available to all bundles. Used for site config and globals.
 *!/
const virtualImports = {
	pi_config: {
		isProduction,
		env: env || 'dev',
		version: `v${new Date().toISOString().replace(/\D/g, '').slice(0, 12)}`
	}
};

/!**
 * Performs main site compilation via Rollup.
 *!/
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
			resolve({
				// dedupe: ['govuk-frontend', '@azure/storage-blob'],
				preferBuiltins: true
			}),
			commonjs(),
			json(),
			babel()
		],
		preserveEntrySignatures: false
	});

	const appGenerated = await appBundle.write({
		// Do we need an import polyfill?
		// dynamicImportFunction: 'window._import',
		entryFileNames: isRelease ? '[name]-[hash].js' : '[name].js',
		dir: 'src/server/static/scripts',
		format: 'iife',
		sourceMap: 'inline',
	});

	const outputFiles = appGenerated.output.map(({fileName}) => fileName);

	// Save the "app.js" entrypoint (which has a hashed name) for the all-browser loader code.
	// @ts-expect-error – package type signature is incorrect
	const entrypoints = appGenerated.output.filter(({isEntry}) => isEntry);

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

	fs.writeFileSync(`${buildDir}/resourceJS.json`, JSON.stringify({path: `/scripts/${appPath}`}));

	// Compress the generated source here, as we need the final files and hashes for the Service Worker manifest.
	if (isProduction) {
		const ratio = await minifySource(outputFiles, 'src/server/static/scripts');

		logger.log(`Minified site code is ${(ratio * 100).toFixed(2)}% of source`);
	}

	logger.success(`Bundled JS ${kleur.blue(appPath)}, total ${outputFiles.length} files`);
}

await build();
*/


const input = 'src/client/app.js';


// see below for details on these options
const inputOptions = {
	input,
	plugins: [
		resolve({
			// dedupe: ['govuk-frontend', '@azure/storage-blob'],
			//preferBuiltins: true
		}),
		commonjs(),
		json(),
		babel({
				babelHelpers: 'bundled',
				// exclude: 'node_modules/**',
				// allowAllFormats: true,
				configFile: path.resolve(process.cwd(), 'babel.config.js'),
			}
		)
	],
	preserveEntrySignatures: false
};

// you can create multiple outputs from the same input to generate e.g.
// different formats like CommonJS and ESM
const outputOptionsList = [{
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'src/server/static/scripts/app.js'
	},
}];

await build();

/**
 *
 */
async function build() {
	let bundle;
	let buildFailed = false;

	try {
		// create a bundle
		bundle = await rollup(inputOptions);
		await generateOutputs(bundle);
	} catch (error) {
		buildFailed = true;
		console.error('ERR::', error);
	}
	if (bundle) {
		// closes the bundle
		await bundle.close();
	}
	process.exit(buildFailed ? 1 : 0);
}

/**
 *
 * @param bundle
 */
async function generateOutputs(bundle) {
	for (const outputOptions of outputOptionsList) {
		const {output} = await bundle.write(outputOptions);

		console.log('file written', output.length)

	}
}
