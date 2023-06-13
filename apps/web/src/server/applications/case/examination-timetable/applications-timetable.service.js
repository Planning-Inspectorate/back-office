import { get, patch, post } from '../../../lib/request.js';

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

	console.log(34, response);

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
 * Publish case timetable items
 * @param {number} caseId
 * @returns {Promise<ApplicationsTimetable[]>}
 */
export const publishCaseTimetableItems = async (caseId) => {
	return patch(`applications/examination-timetable-items/publish/${caseId}`, {});
};
