import formatAddress from '../utils/address-formatter.js';
import formatDate from '../utils/date-formatter.js';
import { lpaQuestionnaireStatesStrings } from '../state-machine/lpa-questionnaire-states.js';

const add2Weeks = function(date) {
	const newDate = new Date(date.valueOf());
	newDate.setDate(newDate.getDate() + 14);
	return newDate;
};

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

const appealFormatter = {
	formatAppealForAllAppeals: function(appeal) { 
		const appealStatus = mapAppealStatus(appeal.status);
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			QuestionnaireStatus: appealStatus,
			AppealSite: formatAddress(appeal.address),
			QuestionnaireDueDate: appeal.startedAt ? formatDate(add2Weeks(appeal.startedAt)) : ''
		};
	},
	formatAppealForAppealDetails: function(appeal) {
		return {
			AppealId : appeal.id,
			AppealReference: appeal.reference,
			LocalPlanningDepartment: appeal.localPlanningDepartment,
			PlanningApplicationreference: appeal.planningApplicationReference,
			AppealSite: formatAddress(appeal.address),
			AppealSiteNearConservationArea: false,
			WouldDevelopmentAffectSettingOfListedBuilding: false,
			...(true && { ListedBuildingDesc: '' }),
			Documents: [
				{
					Type: 'planning application form',
					Filename: 'planning-application.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'decision letter',
					Filename: 'decision-letter.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'appeal statement',
					Filename: 'appeal-statement.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-1.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-2.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-3.pdf',
					URL: 'localhost:8080'
				}
			]
		};
	}
};

export default appealFormatter;
