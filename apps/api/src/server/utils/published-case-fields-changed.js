import * as caseRepository from '../repositories/case.repository.js';
import BackOfficeAppError from './app-error.js';
import { pick } from 'lodash-es';

/** @typedef {import('@pins/applications.api').Schema.Case} Case */

/**
 * Checks whether the published case fields have changed
 *
 * @param {Case} original
 * @param {Case} updated
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
 * @param {import('@pins/applications.api').Schema.Case} caseFields
 * @returns {CaseStatus: Pick<CaseStatus, string> | PartialObject<CaseStatus>, ApplicationDetails: Pick<ApplicationDetails, Exclude<keyof ApplicationDetails, [string[]][number]>> | Omit<ApplicationDetails, keyof ApplicationDetails> | PartialObject<ApplicationDetails>}
 * */
function mapPublishedCaseFields(caseFields) {
	const { applicant, ApplicationDetails, CaseStatus, gridReference } = caseFields || {};
	const { title, description } = caseFields || {};
	const { easting, northing } = gridReference || {};
	const { caseEmail, locationDescription } = ApplicationDetails || {};
	const publishedApplicantFields = pick(applicant || {}, [
		'organisationName',
		'firstName',
		'lastName',
		'address',
		'website',
		'phoneNumber',
		'email'
	]);

	const caseStatus = CaseStatus?.map(({ status }) => status)
		.sort()
		.join(',');

	const regions = ApplicationDetails?.regions
		.map(({ regionId }) => regionId)
		.sort()
		.join(',');

	const zoomLevel = ApplicationDetails?.zoomLevel?.name;

	return {
		title,
		description,
		caseStatus,
		regions,
		zoomLevel,
		gridReference: { easting, northing },
		caseEmail,
		locationDescription,
		applicant: publishedApplicantFields
		// ToDo: remember the key dates data
	};
}
