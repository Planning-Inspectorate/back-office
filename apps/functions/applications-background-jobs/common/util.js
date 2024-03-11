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
