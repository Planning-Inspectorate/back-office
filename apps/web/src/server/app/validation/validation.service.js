import FormData from 'form-data';
import request from './../../lib/request.js';
import localPlanningDepartments from './__dev__/local-planning-departments.js';

/** @typedef {import('@pins/platform').LocalPlanningDepartment} LocalPlanningDepartment } */
/** @typedef {import('@pins/validation').Appeal} Appeal */
/** @typedef {import('@pins/validation').AppealDocumentType} AppealDocumentType */

/**
 * Fetch all local planning departments.
 *
 * @returns {Promise<LocalPlanningDepartment[]>} - A promise that resolves to a
 * collection of local planning department entities.
 */
export function findAllLocalPlanningDepartments() {
	// Temporarily return hardcoded data pending endpoint becoming available
	return Promise.resolve(localPlanningDepartments);
}

export async function findAllNewIncompleteAppeals() {
	const data = await request('validation');

	return data;
}

/**
 * Fetch an appeal for validation.
 *
 * @param {Appeal} appealId - Unique identifier for the appeal.
 * @returns {Promise<Appeal>} - A promise that resolves to the appeal.
 */
export function findAppealById(appealId) {
	return request(`validation/${appealId}`);
}

/**
 * @typedef {Object} AppealDetails
 * @property {string=} AppellantName - The name of the appellant on the appeal.
 * @property {Appeal['AppealSite']=} Address - The site address of the appeal.
 * @property {string=} LocalPlanningDepartment - The local planning department
 * on the appeal.
 */

/**
 * Updates the details of an appeal as identified by the `appealId` parameter.
 * These details can be provided as a full or partial representation. 
 *
 * @param {string} appealId - The unique identifier of the appeal to be updated.
 * @param {AppealDetails} details - A complete or partial set of details to be
 * updated for this appeal.
 * @returns {Promise} - A promise that resolves once the appeal details are
 * remotely updated.
 */
export function updateAppealDetails(appealId, details) {
	return request.patch(`validation/${appealId}`, { json: details });
}

export function updateAppeal(id, data) {
	return request.post(`validation/${id}`, { json: data });

	return data;
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
	return Promise.reject(
		new Error(`validation/${appealId}/documents is not yet implemented!`)
	);
}
