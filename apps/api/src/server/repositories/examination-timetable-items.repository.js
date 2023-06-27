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
	return databaseConnector.examinationTimetableItem.findUnique({
		include: { ExaminationTimetableType: true },
		where: { id }
	});
};

/**
 *
 * @param {number} examinationTimetableId
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItem[] | null>}
 */
export const getByExaminationTimetableId = (examinationTimetableId) => {
	return databaseConnector.examinationTimetableItem.findMany({
		include: { ExaminationTimetableType: true },
		where: { examinationTimetableId },
		orderBy: {
			date: 'asc'
		}
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
 *
 * @param {number} caseId
 * @param {import('@pins/api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.BatchPayload>}
 */
export const updateByCaseId = (caseId, examinationTimetableItem) => {
	return databaseConnector.examinationTimetableItem.updateMany({
		where: {
			caseId
		},
		data: examinationTimetableItem
	});
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

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItem | null>}
 */
export const deleteById = (id) => {
	return databaseConnector.examinationTimetableItem.delete({
		where: { id }
	});
};
