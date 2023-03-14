import { post } from '../../../lib/request.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../applications.types.js').DocumentationFile} DocumentationFile */

/**
 * Save new metadata for the document
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {Partial<DocumentationFile>} newMetaData
 * @returns {Promise<Partial<DocumentationFile> & ValidationErrors>}
 */
export const updateDocumentMetaData = async (caseId, documentGuid, newMetaData) => {
	let response;

	try {
		response = await post(`applications/${caseId}/documents/${documentGuid}/metadata`, {
			json: newMetaData
		});
	} catch {
		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}
	return response;
};
