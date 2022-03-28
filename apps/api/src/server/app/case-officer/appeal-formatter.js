import addressRepository from '../repositories/address.repository.js';
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

export default appealFormatter;
