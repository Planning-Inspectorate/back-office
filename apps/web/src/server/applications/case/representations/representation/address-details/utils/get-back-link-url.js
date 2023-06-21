/**
 * @typedef {object} RepresentationPageLinks
 * @property {string} backLinkUrl
 */

/**
 * @typedef {object} Representation
 * @property {RepresentationPageLinks} pageLinks
 */

/**
 * @typedef {object} Params
 * @property {string} lookup
 * @property {string} find
 */

/**
 * @param {Representation} representation
 * @param {string|undefined} stage
 * @param {Params} params
 * @returns {string}
 */
export const getBackLinkUrl = (representation, stage, params) => {
	switch (stage) {
		case 'find':
			return params.lookup;
		case 'enter':
			return params.find;
		default:
			return representation.pageLinks.backLinkUrl;
	}
};
