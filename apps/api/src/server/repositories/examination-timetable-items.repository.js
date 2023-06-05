import { databaseConnector } from '../utils/database-connector.js';

/**
 * @typedef {import('../utils/mapping/map-examination-timetable-item.js').ExaminationTimetableUpdateRequest } ExaminationTimetableUpdateRequest
 */

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItem | null>}
 */
export const getById = (id) => {
	return databaseConnector.examinationTimetableItem.findUnique({ where: { id } });
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItem[] | null>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.examinationTimetableItem.findMany({
		include: { ExaminationTimetableType: true },
		where: { caseId }
	});
};

/**
 *
 * @param {import('@pins/api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItem>}
 */
export const create = (examinationTimetableItem) => {
	return databaseConnector.examinationTimetableItem.create({ data: examinationTimetableItem });
};

/**
 * Saves an updated Examination Timetable Item to the DB
 *
 * @param {number} id
 * @param {ExaminationTimetableUpdateRequest} examinationTimetableItem
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItem>}
 */
export const update = (id, examinationTimetableItem) => {
	return databaseConnector.examinationTimetableItem.update({
		where: { id: id },
		data: examinationTimetableItem
	});
};
