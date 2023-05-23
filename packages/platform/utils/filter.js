import { isUndefined } from 'lodash-es';

/**
 * Remove any keys from an object where their value is undefined.
 *
 * @template {Object<string,any>} T
 * @param {T} source
 * @returns {T}
 */
export const filterExists = (source) => {
	return /** @type {T} */ (
		Object.fromEntries(Object.entries(source).filter(([, value]) => !isUndefined(value)))
	);
};
