import appealRepository from '../repositories/appeal.repository.js';
import { lpaQuestionnaireStatesStrings } from '../state-machine/lpa-questionnaire-states.js';
import appealFormatter from './appeal-formatter.js';

const caseOfficerStatuses = [
	lpaQuestionnaireStatesStrings.awaiting_lpa_questionnaire,
	lpaQuestionnaireStatesStrings.overdue_lpa_questionnaire,
	lpaQuestionnaireStatesStrings.received_lpa_questionnaire
];

const appealWithQuestionnnaireDetail = {
	AppealId : 1,
	AppealReference: 'APP/Q9999/D/21/1345264',
	LocalPlanningDepartment:'Maidstone Borough Council',
	PlanningApplicationreference:'48269/APP/2021/1482',
	AppealSiteNearConservationArea: false,
	WouldDevelopmentAffectSettingOfListedBuilding: false,
	ListedBuildingDesc: '' // Optional
};

const getAppeals = async function (_request, response) {
	const appeals = await appealRepository.getByStatuses(caseOfficerStatuses);
	const formattedAppeals = await Promise.all(appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal)));
	response.send(formattedAppeals);
};

const getAppealsDetail = function (request, response) {
	response.send(appealWithQuestionnnaireDetail);
};

const confirmingLPAQuestionnaire = function (request, response) {
	response.send();
};

export { getAppeals, getAppealsDetail, confirmingLPAQuestionnaire };
