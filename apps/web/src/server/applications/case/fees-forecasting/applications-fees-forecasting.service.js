import { get, patch, post } from '../../../lib/request.js';
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

/**
 * Post a fee to the invoices endpoint
 *
 * @param {string} caseId
 * @param {object} feeData
 * @returns {Promise<any>}
 */
export async function postNewFee(caseId, feeData) {
	let response;

	try {
		response = await post(`applications/${caseId}/invoices`, {
			json: feeData
		});
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);
		let errorMsg = 'An error occurred, please try again later';
		if (error?.response?.body?.errors) {
			errorMsg = error?.response?.body?.errors;
		}

		response = new Promise((resolve) => {
			resolve({ errors: { msg: errorMsg } });
		});
	}
	return response;
}
