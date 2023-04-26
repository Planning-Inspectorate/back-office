import got, { HTTPError } from 'got';
import config from './config.js';

/**
 *
 * @param {string} documentGuid
 * @param {string} machineAction
 */
const sendRequestToBackOffice = async (documentGuid, machineAction) => {
	await got
		.patch(`https://${config.API_HOST}/applications/documents/${documentGuid}/status`, {
			json: {
				machineAction
			}
		})
		.json();
};

/**
 * @param {string} machineAction
 * @returns {RegExp}
 */
const expectedErrorMessage = (machineAction) => {
	const transitionFrom = {
		check_success: 'not_user_checked',
		check_fail: 'failed_virus_check',
		uploading: 'awaiting_virus_check'
	}[machineAction];

	return new RegExp(`Could not transition '${transitionFrom}' using '${machineAction}'.`);
};

/**
 *
 * @param {Error} error
 * @param {string} machineAction
 * @returns {boolean}
 */
const errorIsDueToDocumentAlreadyMakedWithNewStatus = (error, machineAction) => {
	return (
		error instanceof HTTPError &&
		error.code === 'ERR_NON_2XX_3XX_RESPONSE' &&
		error.response.statusCode === 409 &&
		JSON.parse(error.response.body)?.errors?.application.match(expectedErrorMessage(machineAction))
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
	} catch (error) {
		if (errorIsDueToDocumentAlreadyMakedWithNewStatus(error, machineAction)) {
			log.info(`Document status already updated using the state machine trigger ${machineAction}`);
		} else {
			log.error(error);
			throw error;
		}
	}
};
