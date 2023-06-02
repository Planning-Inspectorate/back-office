import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItem | null>}
 */
export const getById = (id) => {
	return databaseConnector.ExaminationTimetableItem.findUnique({ where: { id } });
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItem[] | null>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.ExaminationTimetableItem.findMany({
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
	return databaseConnector.ExaminationTimetableItem.create({ data: examinationTimetableItem });
};
