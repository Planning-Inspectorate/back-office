import appealRepository from '../repositories/appeal.repository.js';
import { appealStates } from '../state-machine/transition-state.js';
import appealFormatter from './appeal-formatter.js';
import { confirmLPAQuestionnaireService } from './case-officer.service.js';

const getAppeals = async function (_request, response) {
	const caseOfficerStatuses = [
		appealStates.awaiting_lpa_questionnaire,
		appealStates.overdue_lpa_questionnaire,
		appealStates.received_lpa_questionnaire,
		appealStates.incomplete_lpa_questionnaire,
		appealStates.awaiting_statements,
		appealStates.received_statements,
		appealStates.awaiting_comments,
		appealStates.awaiting_final_comments
	];
	const appeals = await appealRepository.getByStatuses(caseOfficerStatuses, true, true);
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal));
	response.send(formattedAppeals);
};

const getAppealDetails = async function (request, response) {
	const appeal = await appealRepository.getById(request.params.appealId, {
		appellant: true,
		address: true,
		latestLPAReviewQuestionnaire: true
	});
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

const confirmLPAQuestionnaire =  async function (request, response) {
	await confirmLPAQuestionnaireService(request.body.reason, request.params.appealId);
	return response.send();
};

export { getAppeals, getAppealDetails, confirmLPAQuestionnaire };
