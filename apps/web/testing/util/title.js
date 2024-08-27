/**
 * Returns the title text extracted from the title tag within the response without formatting
 *
 * @param {{text: string}} response
 * @returns {*|null}
 */
export const getPageTitle = (response) => {
	const match = response.text.match(/<title>([^<]*)<\/title>/);
	return match
		? match[1].replaceAll('\t', ' ').replaceAll('\n', '').replaceAll('  ', ' ').trim()
		: null;
};

/**
 * Builds the expected page title from the page elements
 *
 * @param {string[]} pageElements
 * @param {{error?: boolean}} options
 * @returns {`${string}${string}`}
 */
export const buildPageTitle = (pageElements, options = {}) => {
	return `${options?.error ? 'Error: ' : ''}${['Casework Back Office System', ...pageElements].join(
		' - '
	)}`;
};
