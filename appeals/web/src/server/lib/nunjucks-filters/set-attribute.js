/**
 * Allow adding new properties to nunjucks objects
 *
 * @param {Record<any, any>} existingObject
 * @param {string} key
 * @param {string} value
 * @returns {Record<any, any>}
 */
export function setAttribute(existingObject, key, value) {
	existingObject[key] = value;
	return existingObject;
}
