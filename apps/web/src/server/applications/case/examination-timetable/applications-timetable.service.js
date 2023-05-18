import { get } from '../../../lib/request.js';

/**
 * Get the timetable item types
 *
 * @returns {Promise<{name: string, templateType: string, displayNameEn: string, displayNameCy: string}[]>}
 */
export const getCaseTimetableItemTypes = async () => {
	return get(`applications/examination-timetable-type`);
};

// TODO: just a mock
/**
 * Save new timetable item
 *
 * @param {*} payload
 * @returns {Promise<{errors?: import('@pins/express').ValidationErrors}>}
 */
export const createCaseTimetableItem = async (payload) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(payload);
		}, 1000);
	});
};
