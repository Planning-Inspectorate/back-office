import { databaseConnector } from '#utils/database-connector.js';
import appealRepositoryTemp from '#repositories/appeal.repository.js';
import appealTimetablesRepository from '#repositories/appeal-timetable.repository.js';
import commonRepository from './common.repository.js';

/** @typedef {import('@pins/appeals.api').Appeals.TimetableDeadlineDate} TimetableDeadlineDate */
/** @typedef {import('@pins/appeals.api').Appeals.NotValidReasons} NotValidReasons */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {number} id
 * @param {{
 *  otherNotValidReasons?: string;
 *  appellantCaseValidationOutcomeId?: number;
 * }} data
 * @returns {PrismaPromise<object>}
 */
const updateAppellantCaseById = (id, data) =>
	databaseConnector.appellantCase.update({
		where: { id },
		data
	});

/**
 * @param {{
 * 	appellantCaseId: number,
 *	validationOutcomeId: number,
 *	otherNotValidReasons: string,
 *	incompleteReasons?: NotValidReasons,
 *	invalidReasons?: NotValidReasons,
 *	appealId?: number,
 *	timetable?: TimetableDeadlineDate,
 *	startedAt?: Date
 * }} param0
 * @returns {Promise<object>}
 */
const updateAppellantCaseValidationOutcome = ({
	appellantCaseId,
	validationOutcomeId,
	otherNotValidReasons,
	incompleteReasons,
	invalidReasons,
	appealId,
	timetable,
	startedAt
}) => {
	const transaction = [
		updateAppellantCaseById(appellantCaseId, {
			otherNotValidReasons,
			appellantCaseValidationOutcomeId: validationOutcomeId
		})
	];

	if (incompleteReasons) {
		transaction.push(
			...commonRepository.updateManyToManyRelationTable({
				id: appellantCaseId,
				data: incompleteReasons,
				databaseTable: 'appellantCaseIncompleteReasonOnAppellantCase',
				relationOne: 'appellantCaseId',
				relationTwo: 'appellantCaseIncompleteReasonId'
			})
		);
	}

	if (invalidReasons) {
		transaction.push(
			...commonRepository.updateManyToManyRelationTable({
				id: appellantCaseId,
				data: invalidReasons,
				databaseTable: 'appellantCaseInvalidReasonOnAppellantCase',
				relationOne: 'appellantCaseId',
				relationTwo: 'appellantCaseInvalidReasonId'
			})
		);
	}

	if (appealId && startedAt && timetable) {
		transaction.push(
			appealRepositoryTemp.updateAppealById(appealId, { startedAt: startedAt.toISOString() }),
			appealTimetablesRepository.upsertAppealTimetableById(appealId, timetable)
		);
	}

	return databaseConnector.$transaction(transaction);
};

export default { updateAppellantCaseValidationOutcome };
