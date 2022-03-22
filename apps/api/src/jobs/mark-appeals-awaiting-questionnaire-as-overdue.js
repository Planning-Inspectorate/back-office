import appealRepository from '../server/app/repositories/appeal.repository.js';
import household_appeal_machine from '../server/app/state-machine/household-appeal.machine.js';

/**
 * @returns {Date} date two weeks ago
 */
function getDateTwoWeeksAgo() {
	const date = new Date();
	date.setDate(date.getDate() - 14);
	return date;
}

/**
 * @returns {Array} array of appeals that are in 'awaiting_lpa_questionnaire' state which have been in that state for over two weeks
 */
async function getAppealsWithOverdueQuestionnaires() {
	const twoWeeksAgo = getDateTwoWeeksAgo();
	const appeals = await appealRepository.getByStatusAndLessThanStatusUpdatedAtDate('awaiting_lpa_questionnaire', twoWeeksAgo);
	return appeals;
}

/**
 * @param {Array} appeals appeal that need to be marked overdue
 */
async function markAppealsAsOverdue(appeals) {
	const updatedAppeals = [];
	for (const appeal of appeals) {
		const newStatus = household_appeal_machine.transition(appeal.status, 'OVERDUE');
		updatedAppeals.push(appealRepository.updateStatusById(appeal.id, newStatus.value));
	}
	await Promise.all(updatedAppeals);
}

/**
 * Marks all appeals in the 'awaiting_lpa_questionnaire' state over 2 weeks with status 'overdue_lpa_questionnaire'
 */
async function findAndUpdateStatusForAppealsWithOverdueQuestionnaires() {
	const appeals = await getAppealsWithOverdueQuestionnaires();
	await markAppealsAsOverdue(appeals);
}

await findAndUpdateStatusForAppealsWithOverdueQuestionnaires();

export default findAndUpdateStatusForAppealsWithOverdueQuestionnaires;
