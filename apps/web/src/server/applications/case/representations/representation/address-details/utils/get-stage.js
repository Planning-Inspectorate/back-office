/**
 * @param {*} representation
 * @param {string} repType
 * @returns {boolean}
 */
const hasPostcode = (representation, repType) => representation[repType].address.postcode;

/**
 * @param {string|undefined} stage
 * @param {object} representation
 * @param {string} repType
 * @returns {string}
 */
export const getStage = (stage, representation, repType) =>
	stage ? stage : hasPostcode(representation, repType) ? 'enter' : 'lookup';
