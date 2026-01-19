import { get, patch } from '../../../lib/request.js';
import logger from '../../../lib/logger.js';

/**
 * Get the invoice data for the given case
 *
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export async function getInvoices(caseId) {
	return get(`applications/${caseId}/invoices`);
}

/**
 * Get the meeting data for the given case
 *
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export async function getMeetings(caseId) {
	return get(`applications/${caseId}/meetings`);
}

/**
 * Update an existing case record
 *
 * @param {string} caseId
 * @param {string} sectionName
 * @param {object} feesForecastingData
 * @returns {Promise<any>}
 */
export async function updateFeesForecasting(caseId, sectionName, feesForecastingData) {
	let response;

	try {
		response = await patch(`applications/${caseId}/fees-forecasting/${sectionName}`, {
			json: feesForecastingData
		});
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}
	return response;
}
