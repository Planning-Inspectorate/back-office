import * as caseRepository from '../repositories/case.repository.js';
import BackOfficeAppError from './app-error.js';
import { pick } from 'lodash-es';

/** @typedef {import('@pins/applications.api').Schema.Case} Case */

/**
 * Checks whether the published case fields have changed
 *
 * @param {PartialObject<Case>} original
 * @param {PartialObject<Case>} updated
 * @returns {boolean}
 * */
export const publishedCaseFieldsHaveChanged = (original, updated) => {
	const originalPublishedCaseFields = mapPublishedCaseFields(original);
	const updatedPublishedCaseFields = mapPublishedCaseFields(updated);

	return JSON.stringify(originalPublishedCaseFields) !== JSON.stringify(updatedPublishedCaseFields);
};

/**
 * If `hasUnpublishedChanges = false` and publishable changes have been made,
 * set `hasUnpublishedChanges = true`, otherwise just return `updated`
 *
 * @param {PartialObject<import('@pins/applications.api').Schema.Case>} original
 * @param {PartialObject<import('@pins/applications.api').Schema.Case>} updated
 * @returns {Promise<PartialObject<Case>>}
 * @throws {BackOfficeAppError}
 * */
export const setCaseUnpublishedChangesIfTrue = async (original, updated) => {
	if (updated.hasUnpublishedChanges) {
		return updated;
	}

	const publishableFieldsChanged = publishedCaseFieldsHaveChanged(original, updated);
	if (!publishableFieldsChanged) {
		return updated;
	}

	const result = await caseRepository.updateApplication({
		caseId: updated.id,
		hasUnpublishedChanges: true
	});

	if (!result) {
		throw new BackOfficeAppError(
			`Could not return updated application with id: ${updated.id}`,
			500
		);
	}

	return result;
};

/**
 * Filters out the published case fields for comparison
 *
 * @param {PartialObject<Case>} caseFields
 * @returns {CaseStatus: Pick<CaseStatus, string> | PartialObject<CaseStatus>, ApplicationDetails: Pick<ApplicationDetails, Exclude<keyof ApplicationDetails, [string[]][number]>> | Omit<ApplicationDetails, keyof ApplicationDetails> | PartialObject<ApplicationDetails>}
 * */
function mapPublishedCaseFields(caseFields) {
	const { applicant, ApplicationDetails, CaseStatus, gridReference, title, description } =
		caseFields || {};
	const { easting, northing } = gridReference || {};
	const { caseEmail, locationDescription } = ApplicationDetails || {};

	const caseStatus = CaseStatus?.map(({ status }) => status)
		.sort()
		.join(',');

	const regions = ApplicationDetails?.regions
		?.map(({ regionId }) => regionId)
		.sort()
		.join(',');

	const zoomLevel = ApplicationDetails?.zoomLevel?.name;

	const projectInformation = {
		title, // Project name
		caseStatus, // Case stage
		description, // Project description
		caseEmail, // Project email address
		locationDescription, // Project location
		gridReference: { easting, northing }, // Grid references
		regions, // Regions
		zoomLevel // Map zoom level
	};

	const applicantInformation = pick(applicant || {}, [
		'organisationName', // Organisation name
		'website', // Website
		'email' // Email address
	]);

	const keyDates = pick(ApplicationDetails || {}, [
		'submissionAtPublished', // Anticipated submission date published
		'dateOfDCOSubmission', // Application submitted (Section 55)
		'deadlineForAcceptanceDecision', // Deadline for Acceptance decision
		'dateOfDCOAcceptance', // Date of Acceptance (Section 55)
		'dateOfNonAcceptance', // Date of Non-Acceptance
		'dateOfRepresentationPeriodOpen', // Date Relevant Representations open
		'dateOfRelevantRepresentationClose', // Date Relevant Representations close
		'dateRRepAppearOnWebsite', // Date Relevant Representations to appear on website
		'preliminaryMeetingStartDate', // Preliminary Meeting start date
		'confirmedStartOfExamination', // Examination start date
		'deadlineForCloseOfExamination', // Deadline for close of Examination
		'dateTimeExaminationEnds', // Examination closing date
		'stage4ExtensionToExamCloseDate', // Extension to close of Examination
		'deadlineForSubmissionOfRecommendation', // Deadline for submission of Recommendation
		'dateOfRecommendations', // Date of Recommendation submitted to SoS
		'stage5ExtensionToRecommendationDeadline', // Extension to Recommendation deadline
		'deadlineForDecision', // Deadline for Decision
		'confirmedDateOfDecision', // Date of Decision
		'stage5ExtensionToDecisionDeadline', // Extension to Decision deadline
		'dateProjectWithdrawn' // Date project withdrawn
	]);

	return {
		projectInformation,
		applicantInformation,
		keyDates
	};
}
