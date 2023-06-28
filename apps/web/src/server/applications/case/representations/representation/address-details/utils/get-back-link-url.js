/**
 * @typedef {object} RepresentationPageLinks
 * @property {string} backLinkUrl
 */

/**
 * @typedef {object} Representation
 * @property {RepresentationPageLinks} pageLinks
 */

/**
 * @param {string|undefined} stage
 * @param {string|undefined} postcode
 * @returns {boolean}
 */
const isStageEnterWithoutPostcode = (stage, postcode) => stage === 'enter' && !postcode;

/**
 * @typedef {object} Params
 * @property {string} lookupWithoutPostcode
 * @property {string} lookup
 * @property {string} find
 */

/**
 * @param {Representation} representation
 * @param {string|undefined} stage
 * @param {string|undefined} postcode
 * @param {Params} params
 * @returns {string}
 */
export const getBackLinkUrl = (representation, stage, postcode, params) => {
	let backLinkUrl = representation.pageLinks.backLinkUrl;

	if (isStageEnterWithoutPostcode(stage, postcode)) backLinkUrl = params.lookupWithoutPostcode;
	else if (stage === 'find') backLinkUrl = params.lookup;
	else if (stage === 'enter') backLinkUrl = params.find;

	return backLinkUrl;
};
