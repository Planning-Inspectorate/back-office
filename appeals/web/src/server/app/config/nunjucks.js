import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';
import nunjucks from 'nunjucks';
import * as nunjucksFilters from '../../lib/nunjucks-filters/index.js';
import * as nunjucksGlobals from '../../lib/nunjucks-globals/index.js';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);
const govukFrontendRoot = path.resolve(require.resolve('govuk-frontend'), '../..');

const nunjucksEnvironments = nunjucks.configure(
	[govukFrontendRoot, path.join(dirname, '../../views')],
	{
		// output with dangerous characters are escaped automatically
		autoescape: true,
		// automatically remove trailing newlines from a block/tag
		trimBlocks: true,
		// automatically remove leading whitespace from a block/tag
		lstripBlocks: true,
		// never use a cache and recompile templates each time
		noCache: true
	}
);

// Add all custom app filters
for (const filterName in nunjucksFilters) {
	if (Object.prototype.hasOwnProperty.call(nunjucksFilters, filterName)) {
		nunjucksEnvironments.addFilter(
			filterName,
			nunjucksFilters[/** @type {keyof typeof nunjucksFilters} */ (filterName)]
		);
	}
}

// Add all custom globals
for (const globalName in nunjucksGlobals) {
	if (Object.prototype.hasOwnProperty.call(nunjucksGlobals, globalName)) {
		nunjucksEnvironments.addGlobal(
			globalName,
			nunjucksGlobals[/** @type {keyof typeof nunjucksGlobals} */ (globalName)]
		);
	}
}

export default nunjucksEnvironments;
