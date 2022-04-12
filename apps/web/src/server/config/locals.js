import fs from 'fs';
import { config } from './config.js';

/**
 * Fetch the configuration for a resource in the _data folder.
 *
 * @param {string} filename - The filename of a resource in the _data folder.
 * @returns {{ path: string }} - The resource configuration.
 */
const getConfig = (filename) => {
	const json = fs.readFileSync(new URL(`../_data/${filename}`, import.meta.url), { encoding: 'utf8' });

	return JSON.parse(json);
};

export default {
	cspNonce: 'EdcOUaJ8lczj9tIPO0lPow==',
	isProd: config.isProd,
	isRelease: config.isRelease,
	pathToCss: getConfig('resourceCSS.json').path,
	pathToJs: getConfig('resourceJS.json').path
};
