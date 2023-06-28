import { getRepTypePageTitles } from '../utils/get-rep-type-page-titles.js';
import { getAddressList } from './utils/get-address-list.js';
import { getBackLinkUrl } from './utils/get-back-link-url.js';
import { getStageParams } from './utils/get-stage-params.js';
import { getStage } from './utils/get-stage.js';

const titles = {
	represented: {
		default: 'Address details',
		change: 'Change address details'
	},
	representative: {
		default: 'Add agent address details',
		change: 'Change agent address details'
	}
};

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
		...getRepTypePageTitles(repType, repMode, titles),
		addressList: stage === 'find' && postcode ? await getAddressList(postcode) : [],
		backLinkUrl: getBackLinkUrl(representation, stage, postcode, params),
		params,
		postcode,
		pageKey: repType,
		stage: getStage(stage, representation, repType)
	};
};
