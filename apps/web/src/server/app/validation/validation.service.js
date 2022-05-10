import { appendFilesToFormData } from '@pins/express';
import FormData from 'form-data';
import { get, patch, post } from '../../lib/request.js';

/** @typedef {import('@pins/appeals').AppealDocument} AppealDocument */
/** @typedef {import('@pins/appeals').Validation.Appeal} Appeal */
/** @typedef {import('@pins/express').MulterFile} MulterFile */
/** @typedef {import('@pins/appeals').Validation.AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('@pins/appeals').Validation.AppealDocumentType} AppealDocumentType */
/** @typedef {import('@pins/appeals').Validation.IncompleteReasons} IncompleteReasons */
/** @typedef {import('@pins/appeals').Validation.InvalidReasons } InvalidReasons */

/**
 * Fetch all local planning departments.
 *
 * @returns {Promise<string[]>}
 */
export function findAllLocalPlanningDepartments() {
	return get('validation/lpa-list');
}

/**
 * Fetch all appeals to be validated.
 *
 * @returns {Promise<Appeal[]>}
 */
export function findAllAppeals() {
	return get('validation');
}

/**
 * Fetch an appeal for validation.
 *
 * @param {number} appealId
 * @returns {Promise<Appeal>}
 */
export function findAppealById(appealId) {
	return get(`validation/${appealId}`, { context: { ttl: 10_000 } });
}

/**
 * @typedef {object} AppealDetails
 * @property {string=} AppellantName
 * @property {Appeal['AppealSite']=} Address
 * @property {string=} LocalPlanningDepartment
 * @property {string=} PlanningApplicationReference
 */

/**
 * Update the details of an appeal as identified by the `appealId` parameter.
 * These details can be provided as a full or partial representation.
 *
 * @param {number} appealId
 * @param {AppealDetails} details
 * @returns {Promise<Appeal>}
 */
export function updateAppealDetails(appealId, details) {
	return patch(`validation/${appealId}`, { json: details });
}

/**
 * @typedef {object} ValidAppealData
 * @property {'valid'} status
 * @property {string} descriptionOfDevelopment
 */

/**
 * @typedef {object} InvalidAppealData
 * @property {'invalid'} status
 * @property {InvalidReasons} reasons
 */

/**
 * @typedef {object} IncompleteAppealData
 * @property {'incomplete'} status
 * @property {IncompleteReasons} reasons
 */

/** @typedef {ValidAppealData | InvalidAppealData | IncompleteAppealData} OutcomeData */

/**
 * Record the validation outcome for an appeal.
 *
 * @param {number} appealId
 * @param {OutcomeData} data
 * @returns {Promise<Appeal>}
 */
export function recordOutcome(appealId, { status: AppealStatus, ...other }) {
	return post(`validation/${appealId}`, {
		// TODO: have api align the posted property names of these values with the model
		json:
			'reasons' in other
				? { AppealStatus, Reason: other.reasons }
				: { AppealStatus, descriptionOfDevelopment: other.descriptionOfDevelopment }
	});
}

/**
 * @typedef {object} UploadDocumentData
 * @property {AppealDocumentType} documentType
 * @property {MulterFile} file
 */

/**
 * Upload a document to an appeal according to a given `documentType`.
 *
 * @param {number} appealId
 * @param {UploadDocumentData} data
 * @returns {Promise<AppealDocument>}
 */
export function uploadDocument(appealId, { file, documentType }) {
	const formData = new FormData();

	formData.append('documentType', documentType);
	appendFilesToFormData(formData, { key: 'file', file });

	// Awaiting https://pins-ds.atlassian.net/browse/BOCM-78
	// lpa/${appealId}/documents is not yet implemented so mock created resource
	return Promise.resolve({
		Filename: file.originalname,
		Type: documentType,
		URL: '*'
	});
}
