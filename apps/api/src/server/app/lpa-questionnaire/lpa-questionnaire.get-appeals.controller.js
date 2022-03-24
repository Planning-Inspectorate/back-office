const appealWithQuestionnnaire = [{
	AppealId : 1,
	AppealReference: 'APP/Q9999/D/21/1345264',
	QuestionnaireDueDate:'01 Jun 2022',
	AppealSite:'96 The Avenue, Maidstone, Kent, MD21 5XY',
	QuestionnaireStatus: 'received'
},
{
	AppealId : 2,
	AppealReference: 'APP/Q9999/D/21/5463281',
	QuestionnaireDueDate: '05 Jun 2022',
	AppealSite: '55 Butcher Street, Thurnscoe, S63 0RB',
	QuestionnaireStatus: 'incomplete'
}];

const appealWithQuestionnnaireDetail = {
	AppealId : 1,
	AppealReference: 'APP/Q9999/D/21/1345264',
	AppealSite: '96 The Avenue, Maidstone, Kent, MD21 5XY',
	LocalPlanningDepartment: 'Maidstone Borough Council',
	PlanningApplicationreference: '48269/APP/2021/1482',
	AppealSiteNearConservationArea: false,
	WouldDevelopmentAffectSettingOfListedBuilding: false,
	ListedBuildingDesc: '' // Optional
};

const getAppeals = function (request, response) {
	response.send(appealWithQuestionnnaire);
};

const getAppealsDetail = function (request, response) {
	response.send(appealWithQuestionnnaireDetail);
};

const confirmingLPAQuestionnaire = function (request, response) {
	response.send();
};

export { getAppeals, getAppealsDetail, confirmingLPAQuestionnaire };
