import appealRepository from '../server/app/repositories/appeal.repository.js';
import createHouseholpAppealMachine from '../server/app/state-machine/household-appeal.machine.js';

/**
 * @returns {Array} array of appeals that are in 'awaiting_lpa_questionnaire' or 'overdue_lpa_questionnaire' states
 */
async function getAppealsAwaitingQuestionnaires() {
	const appeals = await appealRepository.getByStatuses(['awaiting_lpa_questionnaire', 'overdue_lpa_questionnaire']);
	return appeals;
}

/**
 * @param {Array} appeals appeal that need to be marked as LPA questionnaire received
 */
async function markAppealsAsLPAReceived(appeals) {
	const updatedAppeals = [];
	for (const appeal of appeals) {
		const newStatus = createHouseholpAppealMachine(appeal.id).transition(appeal.status, 'RECEIVED');
		updatedAppeals.push(appealRepository.updateStatusById(appeal.id, newStatus.value));
	}
	await Promise.all(updatedAppeals);
}

/**
 * Marks all appeals in the 'awaiting_lpa_questionnaire' or 'overdue_lpa_questionnaire' states as received
 */
async function findAndUpdateStatusForAppealsAwaitingQuestionnaires() {
	const appeals = await getAppealsAwaitingQuestionnaires();
	await markAppealsAsLPAReceived(appeals);
}

await findAndUpdateStatusForAppealsAwaitingQuestionnaires();

export default findAndUpdateStatusForAppealsAwaitingQuestionnaires;
