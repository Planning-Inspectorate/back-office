import { get, patch } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Retrieve the list of sectioned key dates for the case
 *
 * @param {number} caseId
 * @returns {Promise<Record<string, Record<string, string|number>> & ValidationErrors>}
 */
export const getAllCaseKeyDates = async (caseId) => {
	let response;

	try {
		response = await get(`applications/${caseId}/key-dates`);
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Update a whole section of key dates
 *
 * @param {number} caseId
 * @param {Record<string, Record<string, number|string>>} newKeyDates
 * @returns {Promise<Record<string, Record<string, string|number>> & ValidationErrors>}
 */
export const updateKeyDates = async (caseId, newKeyDates) => {
	let response;

	try {
		response = await patch(`applications/${caseId}/key-dates`, { json: newKeyDates });
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};
