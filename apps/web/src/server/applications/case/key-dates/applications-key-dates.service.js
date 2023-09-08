import { get } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Save the list of sectioned key dates for the case
 *
 * @param {number} caseId
 * @returns {Promise<Partial<{}> & ValidationErrors>}
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
