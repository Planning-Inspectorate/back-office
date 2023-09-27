import { post, get, patch, head, deleteRequest } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreatePayload} ApplicationsS51CreatePayload */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdatePayload} ApplicationsS51UpdatePayload */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdatePayload} ApplicationsS51ChangeStatusBody */
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
 * @returns {Promise<{newS51Advice?: S51Advice, errors?: ValidationErrors}>}
 * */
export const updateS51Advice = async (caseId, adviceId, payload) => {
	let response;
	try {
		response = await patch(`applications/${caseId}/s51-advice/${adviceId}`, { json: payload });
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
 * @param {ApplicationsS51ChangeStatusBody} payload
 * @returns {Promise<{newS51Advice?: S51Advice, errors?: ValidationErrors}>}
 * */
export const updateS51AdviceStatus = async (caseId, payload) => {
	let response;

	try {
		response = await patch(`applications/${caseId}/s51-advice/`, { json: payload });
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: 'An error occurred, please try again later' });
		});
	}

	return response;
};

/**
 * Check that title of s51 advice doesnt exist already
 *
 * @param {number} caseId
 * @param {string} title
 * @returns {Promise<{validS51Advice?: S51Advice, errors?: ValidationErrors}>}
 * */
export const checkS51NameIsUnique = async (caseId, title) => {
	let response;
	try {
		const urlTitle = title.trim().replace(/\s/g, '%20');
		const validS51Advice = await head(`applications/${caseId}/s51-advice/title-unique/${urlTitle}`);
		response = { validS51Advice };
	} catch (/** @type {*} */ error) {
		pino.error(
			`[API] ${error?.response?.body?.errors?.message || 'Advice title already existing'}`
		);

		response = new Promise((resolve) => {
			resolve({ errors: 'That advice title already exists on this project.  Enter a new title.' });
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
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<S51AdvicePaginatedResponse>}
 */
export const getS51FilesInFolder = async (caseId, page, pageSize) => {
	let response;

	try {
		response = await get(`applications/${caseId}/s51-advice`, {
			searchParams: {
				page,
				pageSize
			}
		});
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve([]);
		});
	}

	return response;
};

/**
 * Get a paginated list for the ready to publish S51 items
 *
 * @param {number} caseId
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {Promise<S51AdvicePaginatedResponse>}
 */
export const getS51AdviceReadyToPublish = async (caseId, pageNumber, pageSize) => {
	let response;

	try {
		response = await post(`applications/${caseId}/s51-advice/ready-to-publish`, {
			json: {
				pageSize,
				pageNumber
			}
		});
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Remove item from the "ready to publish" list
 *
 * @param {number} caseId
 * @param {number} adviceId
 * @returns {Promise<{validS51Advice?: S51Advice, errors?: ValidationErrors}>}
 */
export const removeS51AdviceFromReadyToPublish = async (caseId, adviceId) => {
	let response;

	try {
		response = await post(`applications/${caseId}/s51-advice/remove-queue-item`, {
			json: {
				adviceId
			}
		});
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};
/**
 * Delete s51 advice item
 *
 * @param {number} caseId
 * @param {number} adviceId
 * @returns {Promise<{validS51Advice?: S51Advice, errors?: ValidationErrors}>}
 */
export const deleteS51Advice = async (caseId, adviceId) => {
	let response;

	try {
		response = await deleteRequest(`applications/${caseId}/s51-advice/${adviceId}`);
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.adviceId || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({
				errors: {
					msg: `${
						error?.response?.body?.errors?.adviceId || 'An error occurred, please try again later'
					}`
				}
			});
		});
	}

	return response;
};

/**
 *
 * @param {number} caseId
 * @param {{publishAll?: boolean, ids?: string[]}} _
 * */
export const publishS51AdviceItems = async (caseId, { publishAll, ids }) => {
	try {
		return await post(`applications/${caseId}/s51-advice/publish-queue-items`, {
			json: { publishAll, ids }
		});
	} catch (err) {
		return new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}
};

/**
 * Unpublish S51 advice
 *
 * @param {number} caseId
 * @param {number} adviceId
 * @returns {Promise<{newS51Advice?: S51Advice, errors?: ValidationErrors}>}
 * */
export const unpublishS51Advice = async (caseId, adviceId) => {
	let response;
	try {
		response = await patch(`applications/${caseId}/s51-advice/${adviceId}/unpublish`, { json: {} });
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};