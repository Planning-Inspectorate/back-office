import appealRepository from '../repositories/appeal.repository.js';
import { lpaQuestionnaireStatesStrings } from '../state-machine/lpa-questionnaire-states.js';
import appealFormatter from './appeal-formatter.js';
import CaseOfficerError from './case-officer-error.js';

const caseOfficerStatuses = [
	lpaQuestionnaireStatesStrings.awaiting_lpa_questionnaire,
	lpaQuestionnaireStatesStrings.overdue_lpa_questionnaire,
	lpaQuestionnaireStatesStrings.received_lpa_questionnaire
];

const caseOfficerStatusesOnceQuestionnaireReceived = [
	lpaQuestionnaireStatesStrings.received_lpa_questionnaire	
];

const getAppeals = async function (_request, response) {
	const appeals = await appealRepository.getByStatuses(caseOfficerStatuses);
	const formattedAppeals = await Promise.all(appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal)));
	response.send(formattedAppeals);
};

const getAppealDetails = async function (request, response) {
	const appeal = await getAppealForCaseOfficer(request.params.id);
	const formattedAppeal = await appealFormatter.formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

const confirmingLPAQuestionnaire = function (request, response) {
	response.send();
};

/**
 * @param {string} appealId appeal ID
 * @returns {object} appeal with given ID
 */
async function getAppealForCaseOfficer(appealId) {
	const appeal = await appealRepository.getById(Number.parseInt(appealId, 10));
	if (!caseOfficerStatusesOnceQuestionnaireReceived.includes(appeal.status)) {
		throw new CaseOfficerError('Appeal has yet to receive LPA questionnaire', 400);
	}
	return appeal;
}

export { getAppeals, getAppealDetails, confirmingLPAQuestionnaire };
