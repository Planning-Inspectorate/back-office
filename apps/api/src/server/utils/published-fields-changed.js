import { get, isEqual } from 'lodash-es';

/** @typedef {import('@pins/applications.api').Schema.Case} Case */

/**
 * Checks whether the given column name is included when the case is published
 *
 * @param {Case} original
 * @param {Case} updated
 * @returns {boolean}
 * */
export const publishedFieldsHaveChanged = (original, updated) => {
	/** @type {(path: string[]) => (_original: Case, _updated: Case) => boolean} */
	const compare = (path) => (_original, _updated) => get(_original, path) === get(_updated, path);

	/** @typedef {(o: Case, u: Case) => boolean} Differ */
	/** @type {Differ[]} */
	const conditions = [
		compare(['title']),
		compare(['description']),
		compare(['ApplicationDetails', 'subSectorId']),
		compare(['ApplicationDetails', 'locationDescription']),
		compare(['gridReference', 'easting']),
		compare(['gridReference', 'northing']),
		compare(['ApplicationDetails', 'regions']),
		compare(['ApplicationDetails', 'caseEmail']),
		compare(['ApplicationDetails', 'submissionAtPublished']),
		compare(['ApplicationDetails', 'dateOfDCOSubmission']),
		compare(['ApplicationDetails', 'deadlineForAcceptanceDecision']),
		compare(['ApplicationDetails', 'dateOfDCOAcceptance']),
		compare(['ApplicationDetails', 'dateOfNonAcceptance']),
		compare(['ApplicationDetails', 'dateOfRepresentationPeriodOpen']),
		compare(['ApplicationDetails', 'dateOfRelevantRepresentationClose']),
		compare(['ApplicationDetails', 'dateRRepAppearOnWebsite']),
		compare(['ApplicationDetails', 'preliminaryMeetingStartDate']),
		compare(['ApplicationDetails', 'confirmedStartOfExamination']),
		compare(['ApplicationDetails', 'deadlineForCloseOfExamination']),
		compare(['ApplicationDetails', 'dateTimeExaminationEnds']),
		compare(['ApplicationDetails', 'stage4ExtensionToExamCloseDate']),
		compare(['ApplicationDetails', 'dateOfRecommendations']),
		compare(['ApplicationDetails', 'stage5ExtensionToRecommendationDeadline']),
		compare(['ApplicationDetails', 'confirmedDateOfDecision']),
		compare(['ApplicationDetails', 'stage5ExtensionToDecisionDeadline']),
		compare(['ApplicationDetails', 'dateProjectWithdrawn']),
		(o, u) => isEqual(o.serviceCustomer, u.serviceCustomer)
	];

	return conditions.some((c) => !c(original, updated));
};
