import { databaseConnector } from '../utils/database-connector.js';

export const getAll = () => {
	return databaseConnector.examinationTimetableType.findMany();
};

/**
 *
 * @param {string} name
 * @returns {Promise<import('@pins/api').Schema.ExaminationTimetableType | null>}
 */
export const getByName = (name) => {
	return databaseConnector.examinationTimetableType.findUnique({ where: { name } });
};
