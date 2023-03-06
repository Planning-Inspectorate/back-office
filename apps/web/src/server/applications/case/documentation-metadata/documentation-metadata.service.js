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

	// TODO: this is a mock
	try {
		response = await new Promise((resolve) => {
			setTimeout(() => {
				resolve({ caseId, documentGuid, newMetaData });
			}, 1000);
		});
	} catch {
		response = { errors: 'Error.' };
	}
	return response;
};
