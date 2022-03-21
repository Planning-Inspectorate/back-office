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

// eslint-disable-next-line arrow-body-style
export const makeValidator_StringMatchesOrArrayContainsMatch = (valueToMatch) => {
	return (value) => {
		if (Array.isArray(value)) {
			return value.includes(valueToMatch);
		} else if (typeof value === 'string') {
			return value === valueToMatch;
		}
		return false;
	};
};
