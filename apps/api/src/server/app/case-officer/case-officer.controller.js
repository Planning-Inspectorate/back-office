import appealRepository from '../repositories/appeal.repository.js';
import newReviewRepository from '../repositories/review-questionnaire.repository.js';
import { reviewComplete, validateReviewRequest } from './case-officer-review.js';
import { lpaQuestionnaireStatesStrings } from '../state-machine/lpa-questionnaire-states.js';
import transitionState from '../state-machine/household-appeal.machine.js';
import appealFormatter from './appeal-formatter.js';
import CaseOfficerError from './case-officer-error.js';

const caseOfficerStatuses = [
	lpaQuestionnaireStatesStrings.awaiting_lpa_questionnaire,
	lpaQuestionnaireStatesStrings.overdue_lpa_questionnaire,
	lpaQuestionnaireStatesStrings.received_lpa_questionnaire
];

const caseOfficerStatusesOnceQuestionnaireReceived = new Set([
	lpaQuestionnaireStatesStrings.received_lpa_questionnaire
]);

const getAppeals = async function (_request, response) {
	const appeals = await appealRepository.getByStatusesWithAddresses(caseOfficerStatuses);
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal));
	response.send(formattedAppeals);
};

const getAppealDetails = async function (request, response) {
	const appeal = await getAppealForCaseOfficer(request.params.id);
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

const confirmingLPAQuestionnaire =  async function (request, response) {
	validateReviewRequest(request.body);
	const reviewResult = reviewComplete(request.body);
	const appeal = await getAppealForCaseOfficer(request.params.id);
	await newReviewRepository.addReview(appeal.id, reviewResult, request.body.reason);
	const appealStatemachineStatus = reviewResult ?  'COMPLETE' : 'INCOMPLETE';
	const nextState = transitionState({ appealId: appeal.id }, appeal.status, appealStatemachineStatus);
	await appealRepository.updateStatusById(appeal.id, nextState.value);
	return response.send();
};

/**
 * @param {string} appealId appeal ID
 * @returns {object} appeal with given ID
 */
async function getAppealForCaseOfficer(appealId) {
	const appeal = await appealRepository.getByIdWithAddress(Number.parseInt(appealId, 10));
	if (!caseOfficerStatusesOnceQuestionnaireReceived.has(appeal.status)) {
		throw new CaseOfficerError('Appeal has yet to receive LPA questionnaire', 400);
	}
	return appeal;
}

export { getAppeals, getAppealDetails, confirmingLPAQuestionnaire };
