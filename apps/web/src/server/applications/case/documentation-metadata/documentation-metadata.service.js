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
	let response;

	if (newMetaData.publishedStatus) {
		try {
			response = await patch(`applications/${caseId}/documents`, {
				json: {
					status: newMetaData.publishedStatus,
					documents: [{ guid: documentGuid }]
				}
			});
		} catch {
			response = {
				errors: {
					msg: 'You must fill in all mandatory document properties to publish a document.  Please go back to the document properties screen to make the changes.'
				}
			};
		}
	}

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
