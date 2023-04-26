import { get } from '../../../lib/request.js';

/**
 * Get the timetable item types
 *
 * @returns {Promise<{name: string, templateType: string, displayNameEn: string, displayNameCy: string}[]>}
 */
export const getCaseTimetableItemTypes = async () => {
	return get(`applications/examination-timetable-type`);
};
