import lpaQuestionnaireRepository from '#repositories/lpa-questionnaire.repository.js';
import { broadcastAppealState } from '#endpoints/integrations/integrations.service.js';
import { recalculateDateIfNotBusinessDay } from '#utils/business-days.js';
import { isOutcomeIncomplete } from '#utils/check-validation-outcome.js';
import transitionState from '#state/transition-state.js';
import { AUDIT_TRAIL_SUBMISSION_INCOMPLETE, ERROR_NOT_FOUND } from '../constants.js';
import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';

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
	azureAdUserId,
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

	if (!isOutcomeIncomplete(validationOutcome.name)) {
		await transitionState(
			appealId,
			appealType,
			azureAdUserId,
			appealStatus,
			validationOutcome.name
		);
	} else {
		createAuditTrail({
			appealId,
			azureAdUserId,
			details: stringTokenReplacement(AUDIT_TRAIL_SUBMISSION_INCOMPLETE, ['LPA questionnaire'])
		});
	}

	await broadcastAppealState(appealId);

	return timetable?.lpaQuestionnaireDueDate;
};

export { checkLPAQuestionnaireExists, updateLPAQuestionaireValidationOutcome };
