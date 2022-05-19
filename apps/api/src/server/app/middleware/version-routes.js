/**
 *
 * @param {import('express').Request} request
 * @returns {string}
 */
function getVersion(request) {
	return request.headers['accept-version']?.toString() || '1';
}

/**
 *
 * @param {Object<string, Function>} versionToControllerPairs
 * @returns {Function}
 */
export default function versionRoutes(versionToControllerPairs) {
	/**
	 * @type {import('express').RequestHandler}
	 */
	return function (request, response, next) {
		const version = getVersion(request);

		versionToControllerPairs[version](request, response, next);
		
	};
}
