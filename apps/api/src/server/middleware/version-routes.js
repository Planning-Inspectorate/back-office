import config from '../config/config.js';

/**
 *
 * @param {import('express').Request} request
 * @returns {string}
 */
function getVersion(request) {
	return request.headers['accept-version']?.toString() || config.defaultApiVersion;
}

/** @typedef {Record<number | string, import('express').Router>} ApiVersionConfig */
/** @type {(config: ApiVersionConfig) => import('express').RequestHandler} */
export default function versionRoutes(versionToControllerPairs) {
	return function (request, response, next) {
		const version = getVersion(request);

		return versionToControllerPairs[version](request, response, next);
	};
}
