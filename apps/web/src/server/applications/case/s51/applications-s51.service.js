import { post, get, patch } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreatePayload} ApplicationsS51CreatePayload */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdatePayload} ApplicationsS51UpdatePayload */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdateBody} ApplicationsS51UpdateBody */
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
 * Edit an S51 advice
 *
 * @param {number} caseId
 * @param {number} adviceId
 * @param {ApplicationsS51UpdatePayload} payload
 * @returns {Promise<S51Advice>}
 * */
export const updateS51Advice = async (caseId, adviceId, payload) => {
	try {
		return await patch(`applications/${caseId}/s51-advice/${adviceId}`, { json: payload });
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		throw error;
	}
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

/**
 * Delete the advice attachment by GUID
 *
 * @param {number} adviceId
 * @param {string} attachmentGuid
 * @returns {Promise<*>}
 */
export const deleteS51Attachment = async (adviceId, attachmentGuid) => {
	let response;

	try {
		// TODO: this a mock
		response = Promise.resolve({ adviceId, attachmentGuid });
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'Your item could not be deleted, try again.' } });
		});
	}

	return response;
};

/**
 * Transform ApplicationsS51UpdateBody to ApplicationsS51UpdatePayload
 *
 * @param {ApplicationsS51UpdateBody} body
 * @returns {ApplicationsS51UpdatePayload}
 * */
export const mapUpdateBodyToPayload = (body) => {
	/** @type {ApplicationsS51UpdatePayload} */
	let payload = {
		title: body.title,
		firstName: body.firstName,
		lastName: body.lastName,
		enquirer: body.enquirer,
		enquiryMethod: body.enquiryMethod,
		enquiryDetails: body.enquiryDetails,
		adviser: body.adviser,
		adviceDetails: body.adviceDetails,
		redactedStatus: body.redactedStatus,
		publishedStatus: body.publishedStatus
	};

	if (body['enquiryDate.day'] && body['enquiryDate.month'] && body['enquiryDate.year']) {
		payload.enquiryDate = new Date(
			parseInt(body['enquiryDate.year']),
			parseInt(body['enquiryDate.month']) - 1,
			parseInt(body['enquiryDate.day'])
		);
	}

	if (body['adviceDate.day'] && body['adviceDate.month'] && body['adviceDate.year']) {
		payload.adviceDate = new Date(
			parseInt(body['adviceDate.year']),
			parseInt(body['adviceDate.month']) - 1,
			parseInt(body['adviceDate.day'])
		);
	}

	return payload;
};

/**
 * Transform ApplicationsS51UpdatePayload to ApplicationsS51UpdateBody
 *
 * @param {S51Advice} payload
 * @returns {ApplicationsS51UpdateBody}
 * */
export const mapS51AdviceToPage = (payload) => {
	const enquiryDate = new Date(payload.enquiryDate);
	const adviceDate = new Date(payload.adviceDate);

	return {
		...payload,
		'enquiryDate.day': String(enquiryDate.getDate()),
		'enquiryDate.month': String(enquiryDate.getMonth() + 1),
		'enquiryDate.year': String(enquiryDate.getFullYear()),
		'adviceDate.day': String(adviceDate.getDate()),
		'adviceDate.month': String(adviceDate.getMonth() + 1),
		'adviceDate.year': String(adviceDate.getFullYear())
	};
};
