import got from 'got';
import config from './config.js';

/**
 * @param {string} documentGuid
 * @param {string} caseId
 * @param {string} machineAction
 */
export const sendDocumentStateAction = async (documentGuid, caseId, machineAction) => {
	await got
		.patch(`${config.API_HOST}/applications/${caseId}/documents/${documentGuid}/status`, {
			json: {
				machineAction
			}
		})
		.json();
};
