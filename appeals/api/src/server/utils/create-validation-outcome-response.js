import { isOutcomeIncomplete, isOutcomeInvalid } from './check-validation-outcome.js';

/** @typedef {import('@pins/appeals.api').Schema.AppellantCaseIncompleteReasonOnAppellantCase} AppellantCaseIncompleteReasonOnAppellantCase */
/** @typedef {import('@pins/appeals.api').Schema.AppellantCaseInvalidReasonOnAppellantCase} AppellantCaseInvalidReasonOnAppellantCase */
/** @typedef {import('@pins/appeals.api').Schema.LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire} LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire */
/** @typedef {import('@pins/appeals.api').Schema.AppellantCaseIncompleteReason} AppellantCaseIncompleteReason */
/** @typedef {import('@pins/appeals.api').Schema.LPAQuestionnaireIncompleteReason} LPAQuestionnaireIncompleteReason */
/** @typedef {import('@pins/appeals.api').Appeals.ValidationOutcomeResponse} ValidationOutcomeResponse */

/**
 * @param {AppellantCaseIncompleteReasonOnAppellantCase | LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire} reason
 * @returns {AppellantCaseIncompleteReason | LPAQuestionnaireIncompleteReason}
 */
const incompleteReason = (reason) =>
	'appellantCaseIncompleteReason' in reason
		? reason.appellantCaseIncompleteReason
		: reason.lpaQuestionnaireIncompleteReason;

/**
 * @param {string | null} outcome
 * @param {string | null} [otherNotValidReasons]
 * @param {Array<AppellantCaseIncompleteReasonOnAppellantCase | LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire> | null} [incompleteReasons]
 * @param {AppellantCaseInvalidReasonOnAppellantCase[]} [invalidReasons]
 * @returns {ValidationOutcomeResponse | null}
 */
const createValidationOutcomeResponse = (
	outcome,
	otherNotValidReasons,
	incompleteReasons,
	invalidReasons
) => {
	if (outcome) {
		return {
			outcome: outcome || null,
			...(isOutcomeIncomplete(outcome) && {
				incompleteReasons: incompleteReasons?.map((reason) => incompleteReason(reason).name),
				...(otherNotValidReasons && { otherNotValidReasons })
			}),
			...(isOutcomeInvalid(outcome) && {
				invalidReasons: invalidReasons?.map((reason) => reason.appellantCaseInvalidReason.name),
				...(otherNotValidReasons && { otherNotValidReasons })
			})
		};
	}
	return null;
};

export default createValidationOutcomeResponse;
