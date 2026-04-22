import { get, patch, post, deleteRequest } from '../../../lib/request.js';
import logger from '../../../lib/logger.js';

/**
 * Handle API errors consistently
 *
 * @param {*} error
 * @returns {Promise<{ errors: { msg: string } }>}
 */
function handleApiError(error) {
	logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);

	let errorMsg = 'An error occurred, please try again later';
	if (error?.response?.body?.errors) {
		errorMsg = error?.response?.body?.errors;
	}

	return new Promise((resolve) => {
		resolve({ errors: { msg: errorMsg } });
	});
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
		response = handleApiError(error);
	}
	return response;
}

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
		response = handleApiError(error);
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
		response = handleApiError(error);
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
	try {
		return await deleteRequest(`applications/${caseId}/invoices/${feeId}`);
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);

		return { errors: { msg: `Invoice ${feeId} could not be deleted - please try again` } };
	}
}

/**
 * Get the data for a given meeting
 *
 * @param {string} caseId
 * @param {string} meetingId
 * @returns {Promise<any>}
 */
export async function getMeeting(caseId, meetingId) {
	try {
		return await get(`applications/${caseId}/meetings/${meetingId}`);
	} catch (/** @type {*} */ error) {
		if (error?.response?.statusCode === 404) {
			return null;
		}
		throw error;
	}
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
 * Post a meeting to the meetings endpoint
 *
 * @param {string} caseId
 * @param {Record<string, any>} meetingData
 * @returns {Promise<any>}
 */
export async function postMeeting(caseId, meetingData) {
	const meetingAgenda = meetingData?.agenda || 'Meeting';

	try {
		return await post(`applications/${caseId}/meetings`, {
			json: meetingData
		});
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);

		return { errors: { msg: `${meetingAgenda} could not be created - please try again` } };
	}
}

/**
 * Update an existing meeting via the meetings endpoint
 *
 * @param {string} caseId
 * @param {string} meetingId
 * @param {Record<string, any>} meetingData
 * @returns {Promise<any>}
 */
export async function updateMeeting(caseId, meetingId, meetingData) {
	const meetingAgenda = meetingData?.agenda || 'Meeting';

	try {
		return await patch(`applications/${caseId}/meetings/${meetingId}`, {
			json: meetingData
		});
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);

		return { errors: { msg: `${meetingAgenda} could not be updated - please try again` } };
	}
}

/**
 * Delete a meeting via the meetings endpoint
 *
 * @param {string} caseId
 * @param {string} meetingId
 * @param {string} meetingAgenda
 * @returns {Promise<any>}
 */
export async function deleteMeeting(caseId, meetingId, meetingAgenda) {
	try {
		return await deleteRequest(`applications/${caseId}/meetings/${meetingId}`);
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);

		return { errors: { msg: `${meetingAgenda} could not be deleted - please try again` } };
	}
}
