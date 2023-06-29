import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetable | null>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.examinationTimetable.findUnique({
		where: { caseId }
	});
};

/**
 *
 * @param {import('@pins/applications.api').Schema.ExaminationTimetable} examinationTimetable
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetable>}
 */
export const create = (examinationTimetable) => {
	return databaseConnector.examinationTimetable.create({ data: examinationTimetable });
};

/**
 *
 * @param {number} caseId
 * @param {import('@pins/applications.api').Schema.ExaminationTimetable} examinationTimetable
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetable>}
 */
export const updateByCaseId = (caseId, examinationTimetable) => {
	return databaseConnector.examinationTimetable.update({
		where: { caseId },
		data: examinationTimetable
	});
};

/**
 *
 * @param {number} id
 * @param {import('@pins/applications.api').Schema.ExaminationTimetable} examinationTimetable
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetable>}
 */
export const update = (id, examinationTimetable) => {
	return databaseConnector.examinationTimetable.update({
		where: { id },
		data: examinationTimetable
	});
};
