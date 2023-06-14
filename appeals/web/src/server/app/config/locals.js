import config from '@pins/web/environment/config.js';
import fs from 'node:fs';

/**
 * Fetch the configuration for a resource in the .build folder.
 *
 * @param {string} filename - The filename of a resource in the .build folder
 * @returns {string}
 */
const getConfig = (filename) => {
	try {
		const json = fs.readFileSync(`${config.buildDir}/${filename}`, {
			encoding: 'utf8'
		});

		return JSON.parse(json).path;
	} catch {
		// return empty string if file not found – this will only happen when
		// running the app without building, such as during `npm test`
		return '';
	}
};

export default {
	cspNonce: 'EdcOUaJ8lczj9tIPO0lPow==',
	isProd: config.isProduction,
	isDevelopment: config.isDevelopment,
	isRelease: config.isRelease,
	pathToCss: getConfig('resourceCSS.json'),
	pathToJs: getConfig('resourceJS.json')
};
