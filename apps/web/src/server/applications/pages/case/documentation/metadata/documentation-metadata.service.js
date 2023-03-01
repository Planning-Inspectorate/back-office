/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Get all the metadata for the document
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @returns {Promise<{}|ValidationErrors>}
 */
export const getDocumentMetaData = async (caseId, documentGuid) => {
	let response;

	try {
		response = await new Promise((resolve) => {
			setTimeout(() => {
				resolve({ name: 'A title', description: 'A description', caseId, documentGuid });
			}, 1000);
		});
	} catch {
		response = { errors: 'Error.' };
	}
	return response;
};

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
