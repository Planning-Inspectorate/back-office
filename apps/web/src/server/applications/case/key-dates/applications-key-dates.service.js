import { get, patch } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('@pins/express').ExtendedValidationErrors} ExtendedValidationErrors */

/**
 * Retrieve the list of sectioned key dates for the case
 *
 * @param {number} caseId
 * @returns {Promise<Record<string, Record<string, string|number>> & ExtendedValidationErrors>}
 */
export const getAllCaseKeyDates = async (caseId) => {
	try {
		return await get(`applications/${caseId}/key-dates`);
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		return new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}
};

/**
 * Update a whole section of key dates
 *
 * @param {number} caseId
 * @param {Record<string, Record<string, number|string>>} newKeyDates
 * @returns {Promise<Record<string, Record<string, string|number>> & ExtendedValidationErrors>}
 */
export const updateKeyDates = async (caseId, newKeyDates) => {
	try {
		return await patch(`applications/${caseId}/key-dates`, { json: newKeyDates });
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		return new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}
};
