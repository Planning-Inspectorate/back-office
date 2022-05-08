/**
 * @param {string} sourceString
 * @param {string} searchString
 * @returns {boolean}
 */
export function endsWith(sourceString, searchString) {
	return sourceString ? sourceString.endsWith(searchString) : false;
}
