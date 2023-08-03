import { databaseConnector } from '#utils/database-connector.js';
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
 *  lpaQuestionnaireValidationOutcomeId?: number;
 * }} data
 * @returns {PrismaPromise<object>}
 */
const updateLPAQuestionnaireById = (id, data) =>
	databaseConnector.lPAQuestionnaire.update({
		where: { id },
		data
	});

/**
 * @param {{
 * 	lpaQuestionnaireId: number,
 *  validationOutcomeId: number,
 *	otherNotValidReasons: string,
 *	incompleteReasons?: NotValidReasons,
 *	appealId?: number,
 *	timetable?: TimetableDeadlineDate,
 * }} param0
 * @returns {Promise<object>}
 */
const updateLPAQuestionnaireValidationOutcome = ({
	lpaQuestionnaireId,
	validationOutcomeId,
	otherNotValidReasons,
	incompleteReasons,
	appealId,
	timetable
}) => {
	const transaction = [
		updateLPAQuestionnaireById(lpaQuestionnaireId, {
			otherNotValidReasons,
			lpaQuestionnaireValidationOutcomeId: validationOutcomeId
		})
	];

	if (incompleteReasons) {
		transaction.push(
			...commonRepository.updateManyToManyRelationTable({
				id: lpaQuestionnaireId,
				data: incompleteReasons,
				databaseTable: 'lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire',
				relationOne: 'lpaQuestionnaireId',
				relationTwo: 'lpaQuestionnaireIncompleteReasonId'
			})
		);
	}

	if (appealId && timetable) {
		transaction.push(appealTimetablesRepository.upsertAppealTimetableById(appealId, timetable));
	}

	return databaseConnector.$transaction(transaction);
};

export default { updateLPAQuestionnaireValidationOutcome };
