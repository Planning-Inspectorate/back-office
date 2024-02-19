import config from '#config/config.js';

/**
 *
 * @param {import('express').Request} request
 * @returns {string}
 */
function getVersion(request) {
	if (request.headers['accept-version'] === config.defaultApiVersion) {
		return config.defaultApiVersion;
	}

	const userVersion = Number(request.headers['accept-version']);
	if (userVersion > 0 && userVersion < config.defaultApiVersion) {
		return userVersion.toString();
	}

	return config.defaultApiVersion;
}

/** @typedef {Record<number | string, import('express').Router>} ApiVersionConfig */
/** @type {(config: ApiVersionConfig) => import('express').RequestHandler} */
export default function versionRoutes(versionToControllerPairs) {
	return function (request, response, next) {
		const version = getVersion(request);

		return versionToControllerPairs[version](request, response, next);
	};
}
