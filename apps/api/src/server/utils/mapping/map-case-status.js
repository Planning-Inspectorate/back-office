import { buildAppealCompundStatus } from '../build-appeal-compound-status.js';

/**
 *
 * @param {string | object[]} caseStatus
 * @returns {string | object[]}
 */
export const mapCaseStatus = (caseStatus) => {
	return buildAppealCompundStatus(caseStatus);
};
