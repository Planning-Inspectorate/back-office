import { get, patch, post, deleteRequest } from '../../../lib/request.js';
import logger from '../../../lib/logger.js';

/**
 * Get the invoice data for the given invoice
 *
 * @param {string} caseId
 * @param {string} invoiceId
 * @returns {Promise<any>}
 */
export async function getInvoice(caseId, invoiceId) {
	try {
		return await get(`applications/${caseId}/invoices/${invoiceId}`);
	} catch (/** @type {*} */ error) {
		if (error?.response?.statusCode === 404) {
			return null;
		}
		throw error;
	}
}

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

/**
 * Post a project meeting to the meetings endpoint
 *
 * @param {string} caseId
 * @param {object} projectMeetingData
 * @returns {Promise<any>}
 */
export async function postProjectMeeting(caseId, projectMeetingData) {
	let response;

	try {
		response = await post(`applications/${caseId}/meetings`, {
			json: projectMeetingData
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

/**
 * Update an existing fee via the invoices endpoint
 *
 * @param {string} caseId
 * @param {object} feeData
 * @param {string} feeId
 * @returns {Promise<any>}
 */
export async function updateFee(caseId, feeData, feeId) {
	let response;

	try {
		response = await patch(`applications/${caseId}/invoices/${feeId}`, {
			json: feeData
		});
	} catch (/** @type {*} */ error) {
		// TO-DO: if using this logic, put into a function as it's duplicated in postNewFee
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

/**
 * Delete a fee via the invoices endpoint
 *
 * @param {string} caseId
 * @param {string} feeId
 * @returns {Promise<any>}
 */
export async function deleteFee(caseId, feeId) {
	let response;

	try {
		response = await deleteRequest(`applications/${caseId}/invoices/${feeId}`);
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}
	return response;
}
