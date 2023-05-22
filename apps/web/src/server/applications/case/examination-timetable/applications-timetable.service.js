import { get, post } from '../../../lib/request.js';

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
 * @param {*} payload
 * @returns {Promise<{errors?: import('@pins/express').ValidationErrors}>}
 */
export const createCaseTimetableItem = async (payload) => {
	return post('applications/examination-timetable-items', { json: payload });
};
