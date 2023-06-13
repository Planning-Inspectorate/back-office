/**
 * @typedef {Object.<string, string>} ErrorObject
 */

/**
 * @param {ErrorObject} errors
 * @param {Array<string>} params
 * @returns {object|null}
 */
const getParamErrors = (errors, params) => {
	const paramsWithErrors = params
		.filter((param) => errors[param])
		.map((param) => ({
			[param]: errors[param]
		}));
	return paramsWithErrors.length ? Object.assign({}, ...paramsWithErrors) : null;
};

/**
 * @param {*} errors
 * @param {string} stage
 * @returns {object|null}
 */
export const getStageErrors = (errors, stage) => {
	const fieldsToValidate = [];

	if (stage === 'lookup') fieldsToValidate.push('lookupPostcode');
	else if (stage === 'find') fieldsToValidate.push('address');
	else if (stage === 'enter')
		fieldsToValidate.push('addressLine1', 'addressLine2', 'town', 'postcode', 'country');

	return getParamErrors(errors, fieldsToValidate);
};
