import { get } from 'lodash-es';

export const caseStatusMap = {
	pre_application: 'Pre-Application',
	draft: 'Draft',
	acceptance: 'Acceptance',
	pre_examination: 'Pre-Examination',
	examination: 'Examination',
	recommendation: 'Recommendation',
	decision: 'Decision',
	post_decision: 'Post-Decision',
	withdrawn: 'Withdrawn'
};

/**
 *
 * @param {string} caseStatus
 * @returns {string}
 */
export const mapCaseStatusString = (caseStatus) => get(caseStatusMap, caseStatus, caseStatus);
