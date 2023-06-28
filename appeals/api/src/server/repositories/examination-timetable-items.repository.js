import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/appeals.api').Schema.ExaminationTimetableItem | null>}
 */
export const getById = (id) => {
	return databaseConnector.examinationTimetableItem.findUnique({
		include: { ExaminationTimetableType: true },
		where: { id }
	});
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/appeals.api').Schema.ExaminationTimetableItem[] | null>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.examinationTimetableItem.findMany({
		include: { ExaminationTimetableType: true },
		where: { caseId },
		orderBy: {
			date: 'asc'
		}
	});
};

/**
 *
 * @param {import('@pins/appeals.api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @returns {Promise<import('@pins/appeals.api').Schema.ExaminationTimetableItem>}
 */
export const create = (examinationTimetableItem) => {
	return databaseConnector.examinationTimetableItem.create({ data: examinationTimetableItem });
};

/**
 *
 * @param {number} caseId
 * @param {import('@pins/appeals.api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.BatchPayload>}
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
 *
 * @param {number} id
 * @returns {Promise<import('@pins/appeals.api').Schema.ExaminationTimetableItem | null>}
 */
export const deleteById = (id) => {
	return databaseConnector.examinationTimetableItem.delete({
		where: { id }
	});
};
