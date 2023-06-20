import { getRepresentationPageUrl } from '../../representation.utilities.js';

/**
 * @typedef {object} Params
 * @property {string} lookup
 * @property {string} find
 */

/**
 * @param {string} repId
 * @param {string} repType
 * @param {string|undefined} stage
 * @param {Params} params
 * @returns {string}
 */
export const getBackLinkUrl = (repId, repType, stage, params) => {
	switch (stage) {
		case 'find':
			return params.lookup;
		case 'enter':
			return params.find;
		default:
			return getRepresentationPageUrl(`contact-details`, repId, repType);
	}
};
