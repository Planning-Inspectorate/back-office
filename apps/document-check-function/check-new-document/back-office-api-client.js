import got, { HTTPError } from 'got';
import config from './config.js';

/**
 *
 * @param {string} caseId
 * @param {string} documentGuid
 * @param {string} machineAction
 */
const sendRequestToBackOffice = async (caseId, documentGuid, machineAction) => {
	await got
		.patch(`${config.API_HOST}/applications/${caseId}/documents/${documentGuid}/status`, {
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
		check_fail: 'failed_virus_check'
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
 * @param {string} caseId
 * @param {string} machineAction
 * @param {import('./index.js').Context} context
 */
export const sendDocumentStateAction = async (documentGuid, caseId, machineAction, context) => {
	try {
		await sendRequestToBackOffice(caseId, documentGuid, machineAction);
	} catch (error) {
		if (errorIsDueToDocumentAlreadyMakedWithNewStatus(error, machineAction)) {
			context.info('Document status already updated based on AV checks');
		} else {
			throw error;
		}
	}
};
