import appealRepository from '../server/app/repositories/appeal.repository.js';
import { transitionState } from '../server/app/state-machine/transition-state.js';
import { breakUpCompoundStatus } from '../server/app/utils/break-up-compound-status.js';
import { buildAppealCompundStatus } from '../server/app/utils/build-appeal-compound-status.js';

/**
 * @returns {Date} date two weeks ago
 */
function getDateTwoWeeksAgo() {
	const date = new Date();
	date.setDate(date.getDate() - 14);
	date.setHours(23);
	date.setMinutes(59);
	date.setSeconds(59);
	date.setMilliseconds(999);
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
		const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
		const nextState = transitionState(appeal.appealType.type, { appealId: appeal.id }, appealStatus, 'OVERDUE');
		const newState = breakUpCompoundStatus(nextState.value, appeal.id);
		updatedAppeals.push(appealRepository.updateStatusById(appeal.id, newState, appeal.appealStatus));
	}
	await Promise.all(updatedAppeals);
}

/**
 * Marks all appeals in the 'awaiting_lpa_questionnaire' state over 2 weeks with status 'overdue_lpa_questionnaire'
 */
async function findAndUpdateStatusForAppealsWithOverdueQuestionnaires() {
	const appeals = await getAppealsWithOverdueQuestionnaires();
	console.log(JSON.stringify(appeals));
	await markAppealsAsOverdue(appeals);
}

await findAndUpdateStatusForAppealsWithOverdueQuestionnaires();

export default findAndUpdateStatusForAppealsWithOverdueQuestionnaires;
