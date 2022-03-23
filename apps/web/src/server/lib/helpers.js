import * as url from 'url';

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
 * Factory which creates a function to be passed to an express-validator custom validator
 * The factory function takes a string to match against
 * The returned validator function takes either a string or an array of strings as input
 * If value is an array, it returns true if the array contains the string to match against
 * Else if value is a string, it returns true if it matches the string to match against
 * Else it returns false
 * @param {string} stringToMatch - the value to match against
 * @returns {bool} - true if the string matches or if the array contains a match, else false
 */
export const makeValidator_StringMatchesOrArrayContainsMatch = (stringToMatch) => (value) => {
	if (Array.isArray(value)) {
		return value.includes(stringToMatch);
	} else if (typeof value === 'string') {
		return value === stringToMatch;
	}
	return false;
};

/**
 * Returns the supplied value wrapped in an array, if it is a string. Otherwise returns the value unmodified.
 * Used to ensure checkbox values are always an array of ID strings, even when only one checkbox is checked,
 * in which case the raw value would just be a string.
 * @param {array<string> | string | any} value - the value to normalize
 * @returns {array<string> | any} - an array containing the string, or the unmodified value if it is not a string
 */
export const arrayifyIfString = (value) => {
	if (typeof value === 'string') return [value];
	return value;
};
