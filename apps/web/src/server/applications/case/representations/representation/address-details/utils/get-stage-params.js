import { getRepresentationPageUrl } from '../../representation.utilities.js';

/**
 * @typedef {object} StageParams
 * @property {string} lookup
 * @property {string} find
 * @property {string} enter
 */

/**
 * @param {string} repId
 * @param {string} repType
 * @param {string|undefined} postcode
 * @returns {StageParams}
 */
export const getStageParams = (repId, repType, postcode) => {
	const baseParams = `${getRepresentationPageUrl('', repId, repType)}&postcode=${postcode}&stage=`;

	return {
		lookup: `${baseParams}lookup`,
		find: `${baseParams}find`,
		enter: `${baseParams}enter`
	};
};
