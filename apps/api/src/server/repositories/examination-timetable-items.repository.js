import { databaseConnector } from '../utils/database-connector.js';

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
