/**
 * Concatenate the values of an object into a string.
 *
 * @param {object} object - The source object.
 * @param {string} delimiter – The character(s) which which to join values in the object. Defaults to <br>.
 * @returns {string} - The concatenated string
 */
export function collapse(object = {}, delimiter = '<br>') {
	return Object.values(object).filter(Boolean).join(delimiter);
}
