/**
 * Does the object have all the properties (props)?
 *
 * @param {any} obj
 * @param  {string[]} props
 * @returns {boolean}
 */
export function hasAllProperties(obj, ...props) {
	if (obj === null || typeof obj !== 'object') {
		return false;
	}
	return props.every((prop) => Object.prototype.hasOwnProperty.call(obj, prop));
}
