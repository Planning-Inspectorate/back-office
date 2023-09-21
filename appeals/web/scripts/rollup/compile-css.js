import { loadBaseConfig } from '@pins/applications.web/environment/base-config.js';
import autoprefixer from 'autoprefixer';
import kleur from 'kleur';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import postcss from 'postcss';
import sassEngine from 'sass';
import { getLogger } from './get-logger.js';
import { hashForContent } from './hash.js';

/** @typedef {import('source-map-js').RawSourceMap} RawSourceMap */
/** @typedef {import('postcss').SourceMap} SourceMap */

const { buildDir, isProduction, isRelease } = loadBaseConfig();
const logger = getLogger({ scope: 'Sass' });

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = (/** @type {string} */ relativePath) =>
	path.resolve(appDirectory, relativePath);
const require = createRequire(import.meta.url);

/**
 * @param {string} input filename to read for input
 * @returns {{ css: Buffer | string, map?: RawSourceMap | SourceMap }} CSS compiled object
 */
function compileCSS(input) {
	// #1: Compile CSS with either engine.
	// -----------------------------------
	const compiledOptions = {
		sourceMap: true,
		quietDeps: true,
		loadPaths: [
			resolvePath(`src/styles/env/${isProduction ? 'production' : 'development'}`),
			resolvePath(`src/styles/dev/${isRelease ? 'release' : 'dev'}`),
			// TODO: Find a better way to include the `node_modules` folder.
			// external modules need to be imported in the css with this syntax:
			// "../name_of_the_module/path-to-the-actual-scss
			// there must be a way to get rid of the initial '../'
			path.resolve(require.resolve('govuk-frontend'), '../..'),
			path.resolve(require.resolve('accessible-autocomplete'), '../..')
		]
	};

	logger.log(
		`Compiling (${isProduction ? kleur.magenta('production') : kleur.magenta('development')} / ${
			isRelease ? 'release' : 'dev'
		})`,
		kleur.blue(input)
	);

	const compiledResult = sassEngine.compile(input, compiledOptions);
	const compiledMap = compiledResult.sourceMap;

	// Disabled to be able to click the file in dev tools and open it.
	// // We get back absolute source paths here that look like
	// // "file:///Users/test/Desktop/folder/src/...", so make them relative to here.
	// compiledMap.sources = compiledMap.sources.map((source) => {
	// 	if (source.startsWith('file://')) {
	// 		source = source.substr('file://'.length);
	// 	}
	// 	if (path.isAbsolute(source)) {
	// 		// TODO: Does this needs to be `path.relative(__dirname, '../', source);`
	// 		source = path.relative(__dirname, source);
	// 	}
	// 	return source;
	// });

	if (!isProduction) {
		return { map: compiledMap, css: compiledResult.css };
	}

	// #2: Run postcss for autoprefixer.
	// ---------------------------------
	logger.log('Running postcss (autoprefixer)...');

	const postcssResult = postcss([autoprefixer]).process(compiledResult.css.toString(), {
		from: 'main.css',
		to: 'main.css',
		map: {
			prev: compiledMap,
			annotation: true
		}
	});

	for (const warn of postcssResult.warnings()) {
		logger.warn(warn.toString());
	}

	const { map: candidateMap, css } = postcssResult;

	const map = JSON.parse(candidateMap.toString());

	return { map, css };
}

/**
 * @param {{css: string | Buffer, map?: RawSourceMap | SourceMap }} result to render
 * @param {string} fileName to render to, with optional map in dev
 */
function renderTo(result, fileName) {
	fs.mkdirSync(path.dirname(fileName), { recursive: true });

	const base = path.basename(fileName);

	let out = result.css.toString('utf8');

	out += `\n/*# sourceMappingURL=${base}.map */`;

	fs.writeFileSync(`${fileName}.map`, JSON.stringify({ ...result.map, file: base }));
	fs.writeFileSync(fileName, out);
}

const out = compileCSS('src/styles/main.scss');
const hash = hashForContent(out.css);
const resourceName = isRelease ? `main-${hash}.css` : 'main.css';

logger.log(`Writing generated file to ${kleur.blue(`src/server/static/styles/${resourceName}`)}`);

// We write an unhashed CSS file due to unfortunate real-world caching problems with a hash inside
// the CSS name (we see our old HTML cached longer than the assets are available).
renderTo(out, `src/server/static/styles/${resourceName}`);

if (!fs.existsSync(buildDir)) {
	fs.mkdirSync(buildDir);
}

// Write the CSS entrypoint to a known file, with a query hash, for NJ to read.
fs.writeFileSync(
	`${buildDir}/resourceCSS.json`,
	JSON.stringify({ path: `/styles/${resourceName}` })
);

logger.log(
	`Writing resource JSON file ${kleur.blue('resourceCSS.json')} to ${kleur.blue(
		'.build/resourceCSS.json'
	)}`
);
logger.success(`Finished CSS! (${resourceName})`);
