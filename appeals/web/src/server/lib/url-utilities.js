/**
 *
 * @param {string} url
 * @param {import('@pins/express/types/express.js').Request} request
 * @returns {boolean}
 */
export function isInternalUrl(url, request) {
	try {
		if (url.startsWith('/')) {
			const protocol = request.secure ? 'https' : 'http';
			url = `${protocol}://${request.headers.host}${url}`;
		}
		const targetUrl = new URL(url);
		const requestUrl = new URL(`${request.protocol}://${request.headers.host}`);
		return targetUrl.host === requestUrl.host;
	} catch (error) {
		return false;
	}
}
