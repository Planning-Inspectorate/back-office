import { post, patch } from '../../../lib/request.js';

/** @typedef {import('../../applications.types.js').DocumentationFile} DocumentationFile */

/**
 * Save new / updated metadata for the document
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {Partial<DocumentationFile>} newMetaData
 * @returns {Promise<Partial<DocumentationFile> & { errors: { msg: string } }>}
 */
export const updateDocumentMetaData = async (caseId, documentGuid, newMetaData) => {
	if (newMetaData.publishedStatus) {
		try {
			return await patch(`applications/${caseId}/documents`, {
				json: {
					status: newMetaData.publishedStatus,
					documents: [{ guid: documentGuid }]
				}
			});
		} catch {
			return {
				errors: {
					msg: 'You must fill in all mandatory document properties to publish a document.  Please go back to the document properties screen to make the changes.'
				}
			};
		}
	}

	try {
		return await post(`applications/${caseId}/documents/${documentGuid}/metadata`, {
			json: newMetaData
		});
	} catch {
		return {
			errors: { msg: 'An error occurred, please try again later' }
		};
	}
};
