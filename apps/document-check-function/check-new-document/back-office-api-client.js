import got from 'got';

/**
 * @param {string} documentGuid
 * @param {string} caseId
 * @param {string} machineAction
 */
export const sendDocumentStateAction = async (documentGuid, caseId, machineAction) => {
	await got
		.patch(`http://localhost:3000/applications/${caseId}/documents/${documentGuid}/status`, {
			json: {
				machineAction
			}
		})
		.json();
};
