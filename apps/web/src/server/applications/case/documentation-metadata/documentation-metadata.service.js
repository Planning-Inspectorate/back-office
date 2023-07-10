import { post, patch } from '../../../lib/request.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../applications.types.js').DocumentationFile} DocumentationFile */

/**
 * Save new / updated metadata for the document
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {Partial<DocumentationFile>} newMetaData
 * @returns {Promise<Partial<DocumentationFile> & ValidationErrors>}
 */
export const updateDocumentMetaData = async (caseId, documentGuid, newMetaData) => {
	let response;

	// special case for updating status, routed to the API for updating status
	if (newMetaData.publishedStatus) {
		try {
			response = await patch(`applications/${caseId}/documents/update`, {
				json: {
					status: newMetaData.publishedStatus,
					documents: [{ guid: documentGuid }]
				}
			});
		} catch {
			response = new Promise((resolve) => {
				resolve({
					errors: {
						msg: 'You must fill in all mandatory document properties to publish a document.  Please go back to the document properties screen to make the changes.'
					}
				});
			});
		}
	} else {
		// use std update API for any other properties
		try {
			response = await post(`applications/${caseId}/documents/${documentGuid}/metadata`, {
				json: newMetaData
			});
		} catch {
			response = new Promise((resolve) => {
				resolve({ errors: { msg: 'An error occurred, please try again later' } });
			});
		}
	}
	return response;
};
