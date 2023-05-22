import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItems[] | null>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.examinationTimetableItems.findMany({ where: { caseId } });
};

/**
 *
 * @param {import('@pins/api').Schema.ExaminationTimetableItems} examinationTimetableItem
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableItems>}
 */
export const create = (examinationTimetableItem) => {
	return databaseConnector.examinationTimetableItems.create({ data: examinationTimetableItem });
};
