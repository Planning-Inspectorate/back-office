import { getAddressList } from './utils/get-address-list.js';
import { getBackLinkUrl } from './utils/get-back-link-url.js';
import { getStageParams } from './utils/get-stage-params.js';
import { getStage } from './utils/get-stage.js';
import { getTitles } from './utils/get-titles.js';

/**
 * @typedef {object|*} Locals
 * @property {object} representation
 */

/**
 * @param {object} query
 * @param {Locals} locals
 * @param {string} repType
 * @param {string|undefined} repMode
 * @param {string|undefined} stage
 * @param {string|undefined} postcode
 * @returns {Promise<object>}
 */
export const getAddressDetailsViewModel = async (
	query,
	{ representation },
	repType,
	repMode,
	stage,
	postcode
) => {
	const params = getStageParams(query, postcode);

	return {
		...getTitles(repType, repMode),
		addressList: stage === 'find' && postcode ? await getAddressList(postcode) : [],
		backLinkUrl: getBackLinkUrl(representation, stage, params),
		params,
		postcode,
		pageKey: repType,
		stage: getStage(stage, representation, repType)
	};
};
