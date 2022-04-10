// @ts-check

import FormData from 'form-data';
import { get, post, patch } from './../../lib/request.js';

/** @typedef {import('@pins/validation').Appeal} Appeal */
/** @typedef {import('@pins/validation').AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('@pins/validation').AppealDocumentType} AppealDocumentType */
/** @typedef {import('@pins/validation').IncompleteReasons} IncompleteReasons */
/** @typedef {import('@pins/validation').InvalidReasons } InvalidReasons */

/**
 * Fetch all local planning departments.
 *
 * @returns {Promise<string[]>} - A promise that resolves to a list of local
 * planning department names.
 */
export function findAllLocalPlanningDepartments() {
	return get('validation/lpa-list');
}

/**
 * Fetch all appeals to be validated.
 *
 * @returns {Promise<Appeal[]>} - A promise that resolves to a collection of
 * all appeals awaiting validaton.
 */
export function findAllAppeals() {
	return get('validation');
}

/**
 * Fetch an appeal for validation.
 *
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {Promise<Appeal>} - A promise that resolves to the appeal entity.
 */
export function findAppealById(appealId) {
	return get(`validation/${appealId}`);
}

/**
 * @typedef {Object} AppealDetails
 * @property {string=} AppellantName - The name of the appellant on the appeal.
 * @property {Appeal['AppealSite']=} Address - The site address of the appeal.
 * @property {string=} LocalPlanningDepartment - The local planning department
 * on the appeal.
 * @property {string=} PlanningApplicationReference - The planning application
 * reference to save to the appeal.
 */

/**
 * Update the details of an appeal as identified by the `appealId` parameter.
 * These details can be provided as a full or partial representation.
 *
 * @param {number} appealId - The unique identifier of the appeal to be updated.
 * @param {AppealDetails} details - A complete or partial set of details to be
 * updated for this appeal.
 * @returns {Promise<Appeal>} - A promise that resolves to the appeal once the
 * details are remotely updated.
 */
export function updateAppealDetails(appealId, details) {
	return patch(`validation/${appealId}`, { json: details });
}

/**
 * @typedef {Object} ValidAppealData
 * @property {'valid'} status - The 'valid' {@link AppealOutcomeStatus}
 * @property {string} descriptionOfDevelopment - A description of the valid
 * development by the user.
 */

/**
 * @typedef {Object} InvalidAppealData
 * @property {'invalid'} status - The 'invalid' {@link AppealOutcomeStatus}
 * @property {InvalidReasons} reasons - A dictionary of reasons qualifying the invalid decision.
 */

/**
 * @typedef {Object} IncompleteAppealData
 * @property {'incomplete'} status - The 'incomplete' {@link AppealOutcomeStatus}
 * @property {IncompleteReasons} reasons - A dictionary of reasons qualifying the incomplete decision.
 */

/**
 * @typedef {ValidAppealData | InvalidAppealData | IncompleteAppealData} OutcomeData
 */

/**
 * Record the validation outcome for an appeal.
 *
 * @param {number} appealId - The unique identifier of the appeal.
 * @param {OutcomeData} data - The valid, invalid or incomplete outcome data.
 * @returns {Promise<Appeal>} - A promise that resolves to the appeal once the
 * state is remotely updated.
 */
export function recordOutcome(appealId, { status: AppealStatus, ...other }) {
	return post(`validation/${appealId}`, {
		// TODO: have api align the posted property names of these values with the model
		json: 'reasons' in other ? { AppealStatus, Reason: other.reasons } : { AppealStatus, ...other }
	});
}

/**
 * @typedef {Object} UploadDocumentData
 * @property {AppealDocumentType} documentType - The document type by which to
 * associate the uploaded file.
 * @property {Express.Multer.File} file - A file uploaded via multer.
 */

/**
 * Upload a document to an appeal according to a given `documentType`.
 *
 * @param {number} appealId - Unique identifier for the appeal.
 * @param {UploadDocumentData} data - The buffered file and its metadata.
 * @returns {Promise} - A promise that resolves once the document is uploaded to
 * the appeal.
 */
export function uploadDocument(appealId, { file, documentType }) {
	const formData = new FormData();
	formData.append('documentType', documentType);
	formData.append('fileContent', file.buffer);
	formData.append('filename', file.originalname);

	// Awaiting https://pins-ds.atlassian.net/browse/BOCM-78
	return Promise.reject(new Error(`validation/${appealId}/documents is not yet implemented!`));
}
