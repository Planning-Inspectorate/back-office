import appealRepository from '../repositories/appeal.repository.js';
import { transitionState } from '../state-machine/transition-state.js';
import { arrayOfStatusesContainsString } from '../utils/array-of-statuses-contains-string.js';
import { breakUpCompoundStatus } from '../utils/break-up-compound-status.js';

/**
 * @returns {Array} array of appeals that are in 'awaiting_lpa_questionnaire' or 'overdue_lpa_questionnaire' states
 */
async function getAppealsAwaitingQuestionnaires() {
	const appeals = await appealRepository.getByStatuses([
		'awaiting_lpa_questionnaire',
		'overdue_lpa_questionnaire'
	]);

	return appeals;
}

/**
 * @param {Array} appeals appeal that need to be marked as LPA questionnaire received
 */
async function markAppealsAsLPAReceived(appeals) {
	const updatedAppeals = [];

	for (const appeal of appeals) {
		const appealStatus = arrayOfStatusesContainsString(
			appeal.appealStatus,
			'awaiting_lpa_questionnaire'
		)
			? 'awaiting_lpa_questionnaire'
			: 'overdue_lpa_questionnaire';
		const nextState = transitionState({
			appealType: appeal.appealType.type,
			context:{ appealId: appeal.id },
			status: appealStatus,
			machineAction: 'RECEIVED'
		});
		const newState = breakUpCompoundStatus(nextState.value, appeal.id);

		updatedAppeals.push(
			appealRepository.updateStatusById(appeal.id, newState, appeal.appealStatus)
		);
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
