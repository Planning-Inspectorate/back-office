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
 * mapping for the project case stage (CBOS and Schema - both the same) to the document case stage schema value
 */
export const projectCaseStageToDocumentCaseStageSchemaMap = {
	acceptance: 'acceptance',
	decision: 'decision',
	examination: 'examination',
	post_decision: 'post_decision',
	pre_application: 'pre-application', // note change underscore in project to hyphen in document
	pre_examination: 'pre-examination', // note change underscore in project to hyphen in document
	recommendation: 'recommendation',
	withdrawn: 'withdrawn'
};

/**
 *
 * @param {string} caseStatus
 * @returns {string}
 */
export const mapCaseStatusString = (caseStatus) => get(caseStatusMap, caseStatus, caseStatus);
