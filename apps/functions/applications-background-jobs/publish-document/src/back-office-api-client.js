import { HTTPError } from 'got';
import { requestWithApiKey } from '../../common/backend-api-request.js';
import config from '../../common/config.js';

/**
 *
 * @param {string} documentGuid
 * @param {string} machineAction
 */
const sendRequestToBackOffice = async (documentGuid, machineAction) => {
	await requestWithApiKey
		.patch(`https://${config.API_HOST}/applications/documents/${documentGuid}/status`, {
			json: {
				machineAction
			}
		})
		.json();
};

/**
 *
 * @param {Error} error
 * @returns {boolean}
 */
const errorIsDueToDocumentAlreadyMakedWithNewStatus = (error) => {
	return (
		error instanceof HTTPError &&
		error.code === 'ERR_NON_2XX_3XX_RESPONSE' &&
		error.response.statusCode === 409
	);
};

/**
 * @param {string} documentGuid
 * @param {string} machineAction
 * @param {import('@azure/functions').Logger} log
 */
export const sendDocumentStateAction = async (documentGuid, machineAction, log) => {
	try {
		await sendRequestToBackOffice(documentGuid, machineAction);
	} catch (/** @type {any} */ error) {
		if (errorIsDueToDocumentAlreadyMakedWithNewStatus(error)) {
			log.info(`Document status already updated using the state machine trigger ${machineAction}`);
		} else {
			log.error(error);
			throw error;
		}
	}
};