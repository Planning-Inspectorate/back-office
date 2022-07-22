import { buildAppealCompundStatus } from '../build-appeal-compound-status.js';

/**
 *
 * @param {import('@pins/api').Schema.CaseStatus[]} caseStatus
 * @returns {string | object}
 */
export const mapCaseStatus = (caseStatus) => {
	return buildAppealCompundStatus(caseStatus);
};
