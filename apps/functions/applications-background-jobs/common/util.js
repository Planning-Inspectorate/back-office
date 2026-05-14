/**
 * @param {string} uri
 * @returns {string}
 */
export const extractBlobNameFromUri = (uri) => {
	return new URL(uri).pathname.split('/').slice(2).join('/');
};

/**
 * @param {string} uri
 * @returns {string | null}
 * */
export const guidFromBlobURI = (uri) => {
	const match = uri.match(/^.+\/document-service-uploads\/application\/.+?\/(.+?)\//);
	return match?.[1] ?? null;
};

/**
 * Ensure a string has a trailing slash
 * @param {string} [str]
 * @returns {string|undefined}
 */
export const ensureTrailingSlash = (str) => {
	if (typeof str === 'string' && !str.endsWith('/')) {
		return str + '/';
	}
	return str;
};

/**
 * @param {{ documentType?: string, mime?: string } | undefined} document
 * @returns {boolean}
 */
export const isGisBoundaryGeoJsonDocument = (document) => {
	return document?.documentType === 'GIS shapefile' && document?.mime === 'application/geo+json';
};
