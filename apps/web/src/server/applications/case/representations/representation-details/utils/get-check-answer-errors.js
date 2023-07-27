/**
 * @typedef {Object.<string, string>} errorsToIncludeObject
 */

/**
 * @param {errorsToIncludeObject} errors
 * @returns {errorsToIncludeObject|null}
 */
const getErrorsWithoutRepresentativeValues = (errors) => {
	const errorsToExclude = [
		'representative.firstName',
		'representative.address.postcode',
		'representative.contactMethod'
	];

	/** @type {errorsToIncludeObject} */
	const errorsToInclude = {};

	Object.keys(errors).forEach((error) => {
		if (!errorsToExclude.includes(error)) errorsToInclude[error] = errors[error];
	});

	return Object.keys(errorsToInclude).length ? errorsToInclude : null;
};

/**
 * @typedef {object|*} Locals
 * @property {object} representation
 */

/**
 * @param {Locals} locals
 * @param {object|*} errors
 * @returns {object|null}
 */
export const getCheckAnswerErrors = ({ representation }, errors) =>
	representation.representative.id ? errors : getErrorsWithoutRepresentativeValues(errors);
