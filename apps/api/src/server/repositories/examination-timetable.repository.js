import { databaseConnector } from '#utils/database-connector.js';

/**
 * @typedef {import('@prisma/client').Prisma.ExaminationTimetableGetPayload<{include: {ExaminationTimetableItem: {include: {ExaminationTimetableType: true}}, case: true } }>} ExaminationTimetableWithCaseAndItemsAndType
 */

/**
 * @param {number} id
 * */
export const getById = (id) =>
	databaseConnector.examinationTimetable.findUnique({
		where: { id }
	});

/**
 * Returns a whole Examination Timetable inc case, with associated Examination Timetable Item records inc Exam Type records
 *
 * @param {number} id
 * @returns {import('@prisma/client').PrismaPromise<ExaminationTimetableWithCaseAndItemsAndType |null>}
 * */
export const getWithItems = (id) => {
	return databaseConnector.examinationTimetable.findUnique({
		where: { id },
		include: {
			ExaminationTimetableItem: {
				include: {
					ExaminationTimetableType: true
				}
			},
			case: true
		}
	});
};

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
 * @param {Number} caseId
 * @param {import('@prisma/client').Prisma.ExaminationTimetableUpdateInput} examinationTimetable
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
 * @param {Number} id
 * @param {import('@prisma/client').Prisma.ExaminationTimetableUpdateInput} examinationTimetable
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetable>}
 */
export const update = (id, examinationTimetable) => {
	return databaseConnector.examinationTimetable.update({
		where: { id },
		data: examinationTimetable
	});
};
