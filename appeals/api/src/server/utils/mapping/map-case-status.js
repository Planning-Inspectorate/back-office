import { buildAppealCompundStatus } from '../build-appeal-compound-status.js';
import { mapCaseStatusString } from './map-case-status-string.js';

/**
 *
 * @param {import('@pins/appeals.api').Schema.CaseStatus[] | null} caseStatus
 * @returns {string | object}
 */
export const mapCaseStatus = (caseStatus) => {
	const builtStatuses = buildAppealCompundStatus(caseStatus);

	if (typeof builtStatuses === 'string') {
		return mapCaseStatusString(builtStatuses);
	}
	return builtStatuses;
};
