import { getAddressList } from './utils/get-address-list.js';
import { getBackLinkUrl } from './utils/get-back-link-url.js';
import { getStageParams } from './utils/get-stage-params.js';
import { getStage } from './utils/get-stage.js';

/**
 * @typedef {object|*} Locals
 * @property {string} isRepresented
 * @property {object} representation
 */

/**
 * @param {string} repId
 * @param {string} repType
 * @param {Locals} locals
 * @param {string|undefined} stage
 * @param {string|undefined} postcode
 * @returns {Promise<object>}
 */
export const getAddressDetailsViewModel = async (
	repId,
	repType,
	{ isRepresented, representation },
	stage,
	postcode
) => {
	const params = getStageParams(repId, repType, postcode);

	return {
		addressList: stage === 'find' && postcode ? await getAddressList(postcode) : [],
		backLinkUrl: getBackLinkUrl(repId, repType, stage, params),
		pageTitle: isRepresented ? 'Address details' : 'Add agent address details',
		pageHeading: isRepresented ? 'Address details' : 'Add an agent address',
		params,
		postcode,
		pageKey: repType,
		stage: getStage(stage, representation, repType)
	};
};
