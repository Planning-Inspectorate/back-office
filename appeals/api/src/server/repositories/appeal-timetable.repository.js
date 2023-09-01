import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Appeals.TimetableDeadlineDate} TimetableDeadlineDate */
/** @typedef {import('@pins/appeals.api').Appeals.UpdateTimetableRequest} UpdateTimetableRequest */
/** @typedef {import('@pins/appeals.api').Schema.AppealTimetable} AppealTimetable */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {number} id
 * @param {TimetableDeadlineDate} data
 * @returns {PrismaPromise<AppealTimetable>}
 */
const upsertAppealTimetableById = (id, data) =>
	databaseConnector.appealTimetable.upsert({
		where: { appealId: id },
		update: data,
		create: {
			...data,
			appealId: id
		},
		include: {
			appeal: true
		}
	});

/**
 * @param {number} id
 * @param {UpdateTimetableRequest} data
 * @returns {PrismaPromise<AppealTimetable>}
 */
const updateAppealTimetableById = (id, data) =>
	databaseConnector.appealTimetable.update({
		where: { id },
		data
	});

export default { updateAppealTimetableById, upsertAppealTimetableById };
