import appealRepository from '../repositories/appeal.repository.js';
import addressRepository from '../repositories/address.repository.js';
import formatAddress from '../utils/address-formatter.js';
import formatDate from '../utils/date-formatter.js';
import { lpaQuestionnaireStatesStrings } from '../state-machine/lpa-questionnaire-states.js';

const caseOfficerStatuses = [
	lpaQuestionnaireStatesStrings.awaiting_lpa_questionnaire,
	lpaQuestionnaireStatesStrings.overdue_lpa_questionnaire,
	lpaQuestionnaireStatesStrings.received_lpa_questionnaire
];

/**
 * @param {string} status appeal status
 * @returns {string} reformatted appeal status
 */
function mapAppealStatus(status) {
	switch (status) {
		case lpaQuestionnaireStatesStrings.awaiting_lpa_questionnaire:
			return 'awaiting';
		case lpaQuestionnaireStatesStrings.overdue_lpa_questionnaire:
			return 'overdue';
		case lpaQuestionnaireStatesStrings.received_lpa_questionnaire:
			return 'received';
		default:
			return status;
	}
}

// const appealWithQuestionnnaire = [{
// 	AppealId : 1,
// 	AppealReference: 'APP/Q9999/D/21/1345264',
// 	QuestionnaireDueDate:'01 Jun 2022',
// 	AppealSite:'96 The Avenue, Maidstone, Kent, MD21 5XY',
// 	QuestionnaireStatus: 'received'
// },
// {
// 	AppealId : 2,
// 	AppealReference: 'APP/Q9999/D/21/5463281',
// 	QuestionnaireDueDate: ' 05 Jun 2022',
// 	AppealSite:'55 Butcher Street, Thurnscoe, S63 0RB',
// 	QuestionnaireStatus: 'incomplete'
// }];

const appealWithQuestionnnaireDetail = {
	AppealId : 1,
	AppealReference: 'APP/Q9999/D/21/1345264',
	LocalPlanningDepartment:'Maidstone Borough Council',
	PlanningApplicationreference:'48269/APP/2021/1482',
	AppealSiteNearConservationArea: false,
	WouldDevelopmentAffectSettingOfListedBuilding: false,
	ListedBuildingDesc: '' // Optional
};

const add2Weeks = function(date) {
	const newDate = new Date(date.valueOf());
	newDate.setDate(newDate.getDate() + 14);
	return newDate;
};

const appealFormatter = {
	formatAppealForAllAppeals: async function(appeal) { 
		const address = await addressRepository.getById(appeal.addressId);
		const addressAsString = formatAddress(address);
		const appealStatus = mapAppealStatus(appeal.status);
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			QuestionnaireStatus: appealStatus,
			AppealSite: addressAsString,
			QuestionnaireDueDate: appeal.startedAt ? formatDate(add2Weeks(appeal.startedAt)) : ''
		};
	}
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
