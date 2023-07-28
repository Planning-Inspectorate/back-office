import { DOCUMENT_STATUS_NOT_RECEIVED, DOCUMENT_STATUS_RECEIVED } from '#endpoints/constants.js';
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns {string}
 */
export const formatAppellantCaseDocumentationStatus = (appeal) => {
	if (appeal.appellantCase && appeal.appellantCase.appellantCaseValidationOutcome?.name) {
		return appeal.appellantCase.appellantCaseValidationOutcome.name;
	}

	return appeal.appellantCase ? DOCUMENT_STATUS_RECEIVED : DOCUMENT_STATUS_NOT_RECEIVED;
};

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns {string}
 */
export const formatLpaQuestionnaireDocumentationStatus = (appeal) => {
	if (appeal.lpaQuestionnaire && appeal.lpaQuestionnaire.lpaQuestionnaireValidationOutcome?.name) {
		return appeal.lpaQuestionnaire.lpaQuestionnaireValidationOutcome.name;
	}
	return appeal.lpaQuestionnaire ? DOCUMENT_STATUS_RECEIVED : DOCUMENT_STATUS_NOT_RECEIVED;
};
