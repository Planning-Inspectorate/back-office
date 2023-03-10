import { post } from '../../../lib/request.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Save new metadata for the document
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {*} newMetaData
 * @returns {Promise<ValidationErrors>}
 */
export const updateDocumentMetaData = async (caseId, documentGuid, newMetaData) => {
	let response;

	// console.log(14, newMetaData);

	try {
		// response = await new Promise((resolve) => {
		// 	setTimeout(() => {
		// 		resolve({ caseId, documentGuid, newMetaData });
		// 	}, 1000);
		// });

		response = await post(`applications/${caseId}/documents/${documentGuid}/metadata`, {
			json: newMetaData
		});
	} catch (/** @type {any} */ error) {
		response = { errors: 'Error.', ...error };
	}
	return response;
};
