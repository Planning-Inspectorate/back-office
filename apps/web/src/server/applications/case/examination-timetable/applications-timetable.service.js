import { get, patch, post, deleteRequest } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetable} ApplicationsTimetable */

/**
 * Get the timetable item types
 *
 * @returns {Promise<{id:number, name: string, templateType: string, displayNameEn: string, displayNameCy: string}[]>}
 */
export const getCaseTimetableItemTypes = async () => {
	return get(`applications/examination-timetable-type`);
};

/**
 * Save new timetable item
 *
 * @param {ApplicationsTimetable} payload
 * @returns {Promise<{updatedTimetable?: ApplicationsTimetable, errors?: import('@pins/express').ValidationErrors}>}
 */
export const createCaseTimetableItem = async (payload) => {
	let response;

	try {
		const updatedTimetable = await post('applications/examination-timetable-items', {
			json: payload
		});
		response = { updatedTimetable };
	} catch {
		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Updates an existing timetable item
 *
 * @param {ApplicationsTimetable} payload
 * @returns {Promise<{updatedTimetable?: ApplicationsTimetable, errors?: import('@pins/express').ValidationErrors}>}
 */
export const updateCaseTimetableItem = async (payload) => {
	let response;
	try {
		const updatedTimetable = await patch(`applications/examination-timetable-items/${payload.id}`, {
			json: payload
		});
		response = { updatedTimetable };
	} catch {
		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}
	return response;
};

/**
 * Get case timetable items
 * @param {number} caseId
 * @returns {Promise<ApplicationsTimetable[]>}
 */
export const getCaseTimetableItems = async (caseId) => {
	return get(`applications/examination-timetable-items/case/${caseId}`);
};

/**
 * Get one timetable item by its id
 * @param {number} timetableId
 * @returns {Promise<ApplicationsTimetable>}
 */
export const getCaseTimetableItemById = async (timetableId) => {
	return get(`applications/examination-timetable-items/${timetableId}`);
};

/**
 * Publish case timetable items
 * @param {number} caseId
 * @returns {Promise<ApplicationsTimetable[]>}
 */
export const publishCaseTimetableItems = async (caseId) => {
	// TODO: handle errors
	return patch(`applications/examination-timetable-items/publish/${caseId}`, {});
};

/**
 * Delete single timetable item
 * @param {number} timetableId
 * @returns {Promise<{updatedTimetable?: ApplicationsTimetable, errors?: import('@pins/express').ValidationErrors}>}
 */
export const deleteCaseTimetableItem = async (timetableId) => {
	let response;
	try {
		response = await deleteRequest(`applications/examination-timetable-items/${timetableId}`);
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);
		response = { errors: { msg: 'An error occurred, please try again later' } };
	}

	return response;
};
