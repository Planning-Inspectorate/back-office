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
 *
 * @param {string} documentGuid
 * @param {import('@azure/functions').Logger} log
 * @returns {Promise<{ guid: string, documentName: string, fromFrontOffice: boolean } | null>}
 * */
export const getDocumentProperties = async (documentGuid, log) => {
	try {
		const result = await got
			.get(`https://${config.API_HOST}/applications/documents/${documentGuid}/properties`)
			.json();

		return result;
	} catch (err) {
		log.error(err);
		return null;
	}
};

/**
 *
 * @param {string} documentGuid
 * @param {import('@azure/functions').Logger} log
 * @returns {Promise<{ id: number, displayNameEn: string }[] | null>}
 * */
export const getDocumentFolders = async (documentGuid, log) => {
	try {
		const result = await got
			.get(`https://${config.API_HOST}/applications/documents/${documentGuid}/path`)
			.json();

		return result;
	} catch (err) {
		log.error(err);
		return null;
	}
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
