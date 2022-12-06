import got from 'got';

const apiHost = process.env.API_HOST;

/**
 * @param {string} documentGuid
 * @param {string} caseId
 * @param {string} machineAction
 */
export const sendDocumentStateAction = async (documentGuid, caseId, machineAction) => {
	await got
		.patch(`${apiHost}/applications/${caseId}/documents/${documentGuid}/status`, {
			json: {
				machineAction
			}
		})
		.json();
};
