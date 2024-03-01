import { post, patch } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('../../applications.types.js').DocumentationFile} DocumentationFile */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Save new / updated metadata for the document
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {Partial<DocumentationFile>} newMetaData
 * @returns {Promise<{updatedTimetable?: string, errors?: ValidationErrors}>}
 */
export const updateDocumentMetaData = async (caseId, documentGuid, newMetaData) => {
	if (newMetaData.publishedStatus) {
		return await updatePublishedStatusMetadata(newMetaData.publishedStatus, documentGuid, caseId);
	}

	let response;

	try {
		response = await post(`applications/${caseId}/documents/${documentGuid}/metadata`, {
			json: newMetaData
		});
	} catch (/** @type {*} */ error) {
		const errorMessage = {
			[Object.keys(newMetaData)[0]]: !error?.response?.body?.errors.transcript
				? 'An error occurred, please try again later'
				: 'Please enter a valid document reference number.'
		};

		pino.error(
			`[API] ${
				error?.response?.body?.errors.transcript || error?.response?.body?.errors || 'Unknown error'
			}`
		);

		response = { errors: errorMessage };
	}

	return response;
};

/**
 * Update publishedStatus metadata for the document
 *
 * @param {string} newStatus
 * @param {string} documentGuid
 * @param {number} caseId
 * @returns {Promise<{updatedTimetable?: string, errors?: ValidationErrors}>}
 */
export const updatePublishedStatusMetadata = async (newStatus, documentGuid, caseId) => {
	let response;

	try {
		response = await patch(`applications/${caseId}/documents`, {
			json: {
				status: newStatus,
				documents: [{ guid: documentGuid }]
			}
		});
	} catch (err) {
		// @ts-ignore
		const errors = err?.response?.body?.errors || [
			{ msg: 'Something went wrong, please try again' }
		];
		response = {
			// @ts-ignore
			errors: errors.map((error) => {
				if (error.type === 'missing-properties') {
					return {
						...error,
						msg:
							error.msg + ' Please go back to the document properties screen to make the changes.'
					};
				} else {
					return error;
				}
			})
		};
	}

	return response;
};
