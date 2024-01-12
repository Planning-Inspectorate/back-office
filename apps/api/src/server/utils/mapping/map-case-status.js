import { mapCaseStatusString } from './map-case-status-string.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.CaseStatus[] | null} caseStatus
 * @returns {string | object}
 */
export const mapCaseStatus = (caseStatus) => {
	if (typeof caseStatus === 'undefined' || caseStatus === null || !Array.isArray(caseStatus)) {
		throw new TypeError('No Case Status Provided');
	}

	const builtStatus = caseStatus[0].status;

	if (typeof builtStatus !== 'string') {
		throw new TypeError('No Valid Status Provided');
	}

	return mapCaseStatusString(builtStatus);
};
