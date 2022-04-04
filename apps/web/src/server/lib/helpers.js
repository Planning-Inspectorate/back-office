import * as url from 'url';
import { camelCase } from 'lodash-es';

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/**
 * Transforms checkbox data for a single checkbox group form field into an object intended to be passed into nunjucks templates.
 * The object is used in templates to set the initial state of each checkbox (for example, setting checkboxes to values the user checked when re-rendering form in an error state)
 *
 * @param {array<string> | string} checkboxData - array of strings (or single string) containing ID(s) of checked checkboxes in a form field (eg. ['2', '4'] or '2')
 * @returns {object} - object with a key for each "true" item in the supplied checkboxData (key name = checkboxData ID, value = true)
 */
export const checkboxDataToCheckValuesObject = (checkboxData) => {
	if (Array.isArray(checkboxData)) {
		// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
		return checkboxData.reduce((previous, current) => {
			previous[current] = true;
			return previous;
		}, {});
	} else if (typeof checkboxData === 'string') {
		return { [checkboxData]: true };
	} else {
		return checkboxData;
	}
};

/**
 * Transforms an AppealSite object, as returned from the API, into a string, with valid address fragments separated by the supplied separator.
 *
 * @param {object} appealSite - AppealSite object in the format returned by the API
 * @param {string} separator - Separator to use (defaults to comma)
 * @returns {string} - string containing the resulting address formatted as a single line with address fragments separated by supplied separator
 */
export const appealSiteObjectToText = (appealSite, separator) => {
	let addressString = '';
	const keys = Object.keys(appealSite);

	if (!separator) separator = ', ';

	// eslint-disable-next-line unicorn/no-for-loop
	for (let i = 0; i < keys.length; i++) {
		const entry = appealSite[keys[i]];
		if (!entry) continue;
		addressString += entry + (i < keys.length - 1 ? separator : '');
	}

	return addressString;
};
