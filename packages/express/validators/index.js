/**
 * @callback ValidatorFn
 * @param {*} value - The value to validate.
 * @returns {boolean} - True if the value passed validation.
 */

/**
 * @typedef {Object} CreateWhitelistedKeysValidatorOptions
 * @property {string[]} whitelist - An array of values allowed as object keys.
 * @property {string} errorMessage - The error message. Use {{ }} to interpolate
 * the failing key.
 */

 const INTERPOLATION_REGEX = /{{([^}]+)}}/;

/**
 * Create a validator that rejects any unknowns keys.
 * 
 * @param {CreateWhitelistedKeysValidatorOptions} options - The validator options.
 * @returns {ValidatorFn}
 */
export const createWhitelistedKeysValidator =
	({ whitelist, errorMessage }) =>
	(value) => {
		for (const key of Object.keys(value)) {
			if (!whitelist.includes(key)) {
				throw new Error(errorMessage.replace(INTERPOLATION_REGEX, key));
			}
		}
		return true;
	};
