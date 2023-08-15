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
 * @returns {Promise<{ guid: string, documentName: string, fromFrontOffice: boolean } | null>}
 * */
export const getDocumentProperties = async (documentGuid) => {
	try {
		const result = await got
			.get(`https://${config.API_HOST}/applications/document/${documentGuid}/properties`)
			.json();

		return result;
	} catch {
		return null;
	}
};

/**
 *
 * @param {string} documentGuid
 * @returns {Promise<{ id: number, displayNameEn: string }[] | null>}
 * */
export const getDocumentFolders = async (documentGuid) => {
	try {
		const result = await got
			.get(`https://${config.API_HOST}/applications/document/${documentGuid}/path`)
			.json();

		return result;
	} catch {
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
	} catch (error) {
		if (errorIsDueToDocumentAlreadyMakedWithNewStatus(error)) {
			log.info(`Document status already updated using the state machine trigger ${machineAction}`);
		} else {
			log.error(error);
			throw error;
		}
	}
};
