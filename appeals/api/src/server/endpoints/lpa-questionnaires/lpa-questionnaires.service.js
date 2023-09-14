import lpaQuestionnaireRepository from '#repositories/lpa-questionnaire.repository.js';
import { recalculateDateIfNotBusinessDay } from '#utils/business-days.js';
import { isOutcomeIncomplete } from '#utils/check-validation-outcome.js';
import transitionState from '#state/transition-state.js';
import { ERROR_NOT_FOUND } from '../constants.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('@pins/appeals.api').Appeals.UpdateLPAQuestionaireValidationOutcomeParams} UpdateLPAQuestionaireValidationOutcomeParams */

/**
 * @type {RequestHandler}
 * @returns {object | void}
 */
const checkLPAQuestionnaireExists = (req, res, next) => {
	const {
		appeal,
		params: { lpaQuestionnaireId }
	} = req;
	const hasLPAQuestionnaire = appeal.lpaQuestionnaire?.id === Number(lpaQuestionnaireId);

	if (!hasLPAQuestionnaire) {
		return res.status(404).send({ errors: { lpaQuestionnaireId: ERROR_NOT_FOUND } });
	}

	next();
};

/**
 * @param {UpdateLPAQuestionaireValidationOutcomeParams} param0
 * @returns {Promise<Date | undefined>}
 */
const updateLPAQuestionaireValidationOutcome = async ({
	appeal,
	data,
	lpaQuestionnaireId,
	validationOutcome
}) => {
	let timetable = undefined;

	const { id: appealId, appealStatus, appealType } = appeal;
	const { lpaQuestionnaireDueDate, incompleteReasons } = data;

	if (lpaQuestionnaireDueDate) {
		timetable = {
			lpaQuestionnaireDueDate: await recalculateDateIfNotBusinessDay(lpaQuestionnaireDueDate)
		};
	}

	await lpaQuestionnaireRepository.updateLPAQuestionnaireById(lpaQuestionnaireId, {
		validationOutcomeId: validationOutcome.id,
		...(isOutcomeIncomplete(validationOutcome.name) && {
			appealId,
			incompleteReasons,
			timetable
		})
	});

	await transitionState(appealId, appealType, appealStatus, validationOutcome.name);

	return timetable?.lpaQuestionnaireDueDate;
};

export { checkLPAQuestionnaireExists, updateLPAQuestionaireValidationOutcome };
