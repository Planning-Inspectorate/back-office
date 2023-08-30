import { post, get } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreatePayload} ApplicationsS51CreatePayload */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../applications.types.js').S51Advice} S51Advice */
/** @typedef {import('../../applications.types.js').PaginatedResponse<S51Advice>} S51AdvicePaginatedResponse */
/** @typedef {import('./applications-s51.types.js').S51BlobResponse} S51BlobResponse */

/**
 * Save new S51 advice
 *
 * @param {ApplicationsS51CreatePayload} payload
 * @returns {Promise<{newS51Advice?: S51Advice, errors?: ValidationErrors}>}
 */
export const createS51Advice = async (payload) => {
	let response;

	try {
		const newS51Advice = await post('applications/s51-advice', {
			json: payload
		});
		response = { newS51Advice };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Get S51 advice by id
 *
 * @param {number} caseId
 * @param {number} adviceId
 * @returns {Promise<S51Advice>}
 */
export const getS51Advice = async (caseId, adviceId) => {
	let response;

	try {
		response = await get(`applications/${caseId}/s51-advice/${adviceId}`);
		// response = { s51Advice };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Get the advice items for the current case
 *
 * @param {number} caseId
 * @param {number} pageSize
 * @param {number} pageNumber
 * @returns {Promise<S51AdvicePaginatedResponse>}
 */
export const getS51FilesInFolder = async (caseId, pageSize, pageNumber) =>
	get(`applications/${caseId}/s51-advice`, {
		searchParams: {
			page: pageNumber,
			pageSize
		}
	});
