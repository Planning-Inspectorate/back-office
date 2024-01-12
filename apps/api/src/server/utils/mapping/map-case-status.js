import { mapCaseStatusString } from './map-case-status-string.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.CaseStatus[] | null} caseStatuses
 * @returns {string | object}
 */
export const mapCaseStatus = (caseStatuses) => {
	if (
		typeof caseStatuses === 'undefined' ||
		caseStatuses === null ||
		!Array.isArray(caseStatuses)
	) {
		throw new TypeError('No Case Statuses Provided');
	}

	const validStatus = caseStatuses.find((caseStatus) => typeof caseStatus.status === 'string');

	if (!validStatus) {
		throw new TypeError('No `Case status` with valid status provided');
	}

	return mapCaseStatusString(validStatus.status);
};
