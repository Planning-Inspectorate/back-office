/**
 *
 * @param {any} query
 * @returns {string}
 */
export const buildQueryString = (query) => {
	const params = new URLSearchParams(query);

	return Array.from(params.entries())
		.map(
			([prop, val]) =>
				`${prop}=${
					val === 'undefined' ? '' : val.split(',').map(encodeURIComponent).join(`&${prop}=`)
				}`
		)
		.join('&');
};
