import { get } from 'lodash-es';

/**
 *
 * @param {string} caseStatus
 * @returns {string}
 */
export const mapCaseStatusString = (caseStatus) => {
	const caseStatusMap = {
		pre_application: 'Pre-Application'
	};

	return get(caseStatusMap, caseStatus, caseStatus);
};
