'use strict';

const fs = require('node:fs');
const path = require('node:path');
const kleur = require('kleur');
const sassEngine = require('sass');
// const Fiber = require('fibers');
const { hashForContent } = require('../lib/hash');
const getLogger = require('../lib/get-logger');
const { notify } = require('../lib/notifier');
const { loadEnvironment } = require('planning-inspectorate-libs');

loadEnvironment(process.env.NODE_ENV);

const isProduction = process.env.NODE_ENV === 'production';
const isRelease = process.env.APP_RELEASE === 'true';
const logger = getLogger({ scope: 'Sass'});

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = (relativePath) => path.resolve(appDirectory, relativePath);

/**
 * @param {string} input filename to read for input
 * @returns {{css: !Buffer, map: !SourceMap}} CSS compiled object
 */
function compileCSS(input) {
	// #1: Compile CSS with either engine.
	const compiledOptions = {
		file: input,
		outFile: 'main.css',
		sourceMap: true,
		quietDeps: true,
		omitSourceMapUrl: true, // since we just read it from the result object
		// Enabled it when using render instead of renderSync
		// fiber: Fiber, // This increases perf for render https://github.com/sass/dart-sass#javascript-api
		includePaths: [
			resolvePath(`src/styles/env/${isProduction ? 'production' : 'development'}`),
			resolvePath(`src/styles/dev/${isRelease ? 'release' : 'dev'}`),
			// TODO: Find a better way to include these paths.
			// We are including the govuk-frontend to be fix the NPM workspaces module resolution issues
			// as we can't import files directly from the node_modules folder.
			path.resolve(require.resolve('govuk-frontend'), '../..'),
		]
	};

	if (isProduction) {
		compiledOptions.outputStyle = 'compressed';
	}

	// eslint-disable-next-line max-len
	logger.log(`Compiling (${isProduction ? kleur.magenta('production') : kleur.magenta('development')} / ${isRelease ? 'release' : 'dev'})`, kleur.blue(input));

	const compiledResult = sassEngine.renderSync(compiledOptions);
	const compiledMap = JSON.parse(compiledResult.map.toString('utf8'));

	// nb. We get back absolute source paths here that look like
	// "file:///Users/test/Desktop/folder/src/...", so make them relative to here.
	compiledMap['sources'] = compiledMap['sources'].map((source) => {
		if (source.startsWith('file://')) {
			source = source.substr('file://'.length);
		}
		if (path.isAbsolute(source)) {
			// TODO: Does this needs to be `path.relative(__dirname, '../', source);`
			source = path.relative(__dirname, source);
		}
		return source;
	});

	if (!isProduction) {
		return { map: compiledMap, css: compiledResult.css };
	}

	// nb. Only require() dependencies for autoprefixer when used.
	const autoprefixer = require('autoprefixer');
	const postcss = require('postcss');

	// #2: Run postcss for autoprefixer.
	const postcssOptions = {
		from: 'main.css',
		to: 'main.css',
		map: {
			prev: compiledMap,
			annotation: true
		}
	};
	logger.log('Running postcss (autoprefixer)...');
	const postcssResult = postcss([autoprefixer]).process(
		compiledResult.css.toString(),
		postcssOptions
	);
	postcssResult.warnings().forEach((warn) => {
		logger.warn(warn.toString());
	});

	const { css, map: candidateMap } = postcssResult;

	// nb. With the transpiled "sass", this is returned as a SourceMapGenerator, so convert it to
	// a real string and then back to JSON.
	const map = JSON.parse(candidateMap.toString('utf8'));
	return { map, css };
}

/**
 * @param {{css: !Buffer, map: !SourceMap}} result to render
 * @param {string} fileName to render to, with optional map in dev
 */
function renderTo(result, fileName) {
	fs.mkdirSync(path.dirname(fileName), { recursive: true });
	const base = path.basename(fileName);

	let out = result.css.toString('utf8');
	if (!isProduction) {
		result.map['file'] = base;

		out += `\n/*# sourceMappingURL=${base}.map */`;
		fs.writeFileSync(fileName + '.map', JSON.stringify(result.map));
	}

	fs.writeFileSync(fileName, out);
}

const out = compileCSS('src/styles/main.scss');
const hash = hashForContent(out.css);

// We write an unhashed CSS file due to unfortunate real-world caching problems with a hash inside
// the CSS name (we see our old HTML cached longer than the assets are available).
renderTo(out, `src/server/static/styles/main.css`);
logger.log(`Writing generated file to ${kleur.blue('src/server/static/styles/main.css')}`);

// Write the CSS entrypoint to a known file, with a query hash, for Eleventy to read.
const resourceName = `main.css?v=${hash}`;
fs.writeFileSync(
	'src/server/_data/resourceCSS.json',
	JSON.stringify({path: `/styles/${resourceName}`}),
);
logger.log(`Writing resource JSON file ${kleur.blue('resourceCSS.json')} to ${kleur.blue('src/server/_data/resourceCSS.json')}`);

logger.success(`Finished CSS! (${resourceName})`);
notify('Compiled CSS files');
