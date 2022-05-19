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
 * @param {object} versionToControllerPairs 
 * @returns {function}
 */
export default function versionRoutes(versionToControllerPairs) {
    /**
     * @type {import('express').RequestHandler}
     */
	return function(request, response, next) {
		const that = this;
		const version = getVersion(request);
		versionToControllerPairs[version].call(that, request, response, next);
        return
	}
}
