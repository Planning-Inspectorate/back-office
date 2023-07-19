import appealRepository from '#repositories/appeal.repository.js';
import logger from '#utils/logger.js';
import { ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';
import { formatLpaQuestionnaire } from './lpa-questionnaires.formatter.js';
import { isOutcomeIncomplete } from '#utils/check-validation-outcome.js';
import { recalculateDateIfNotBusinessDay } from '#utils/business-days.js';
import transitionState from '../../state/transition-state.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {object}
 */
const getLpaQuestionnaireById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = formatLpaQuestionnaire(appeal);

	return res.send(formattedAppeal);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const updateLPAQuestionnaireById = async (req, res) => {
	const {
		appeal: { id: appealId, appealStatus, appealType },
		body,
		body: { incompleteReasons, otherNotValidReasons },
		params: { lpaQuestionnaireId },
		validationOutcome
	} = req;

	try {
		let timetable = undefined;

		if (body.lpaQuestionnaireDueDate) {
			timetable = {
				lpaQuestionnaireDueDate: await recalculateDateIfNotBusinessDay(body.lpaQuestionnaireDueDate)
			};
		}

		await appealRepository.updateLPAQuestionnaireValidationOutcome({
			lpaQuestionnaireId: Number(lpaQuestionnaireId),
			validationOutcomeId: validationOutcome.id,
			otherNotValidReasons,
			...(isOutcomeIncomplete(validationOutcome.name) && {
				appealId,
				incompleteReasons,
				timetable
			})
		});

		await transitionState(appealId, appealType, appealStatus, validationOutcome.name);

		body.lpaQuestionnaireDueDate = timetable?.lpaQuestionnaireDueDate;
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getLpaQuestionnaireById, updateLPAQuestionnaireById };
