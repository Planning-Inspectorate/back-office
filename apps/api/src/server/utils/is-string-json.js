/**
 * Is string a valid JSON
 *
 * @param {string} str
 * @returns {boolean}
 */
export function isStringJSON(str) {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}
