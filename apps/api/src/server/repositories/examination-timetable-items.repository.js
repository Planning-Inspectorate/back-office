import { databaseConnector } from '../utils/database-connector.js';

/**
 * @typedef {import('../utils/mapping/map-examination-timetable-item.js').ExaminationTimetableUpdateRequest } ExaminationTimetableUpdateRequest
 */

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetableItem | null>}
 */
export const getById = (id) => {
	return databaseConnector.examinationTimetableItem.findUnique({
		include: { ExaminationTimetableType: true, ExaminationTimetable: true },
		where: { id }
	});
};

/**
 *
 * @param {number} examinationTimetableId
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetableItem[] | null>}
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
 * returns all exam timetable item records for this exam timetable, where the item name matches.
 * ignoreSelfId ignores that record id, used when updating.  For creating a new record, this should be null
 *
 * @param {number} examinationTimetableId
 * @param {string} examinationTimetableName
 * @param {number |null} ignoreSelfId
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetableItem[] | null>}
 */
export const getByExaminationTimetableName = (
	examinationTimetableId,
	examinationTimetableName,
	ignoreSelfId
) => {
	let whereClause = {
		name: examinationTimetableName,
		examinationTimetableId: examinationTimetableId
	};
	if (ignoreSelfId) {
		// @ts-ignore
		whereClause.NOT = { id: ignoreSelfId };
	}

	return databaseConnector.examinationTimetableItem.findMany({
		include: { ExaminationTimetableType: true },
		where: whereClause,
		orderBy: {
			date: 'asc'
		}
	});
};

/**
 *
 * @param {import('@pins/applications.api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetableItem>}
 */
export const create = (examinationTimetableItem) => {
	return databaseConnector.examinationTimetableItem.create({ data: examinationTimetableItem });
};

/**
 * Saves an updated Examination Timetable Item to the DB
 *
 * @param {number} id
 * @param {ExaminationTimetableUpdateRequest} examinationTimetableItem
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetableItem>}
 */
export const update = (id, examinationTimetableItem) => {
	return databaseConnector.examinationTimetableItem.update({
		where: { id },
		data: examinationTimetableItem
	});
};

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetableItem | null>}
 */
export const deleteById = (id) => {
	return databaseConnector.examinationTimetableItem.delete({
		where: { id }
	});
};
