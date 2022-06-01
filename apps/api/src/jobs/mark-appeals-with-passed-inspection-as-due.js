import appealRepository from '../server/app/repositories/appeal.repository.js';
import { transitionState } from '../server/app/state-machine/transition-state.js';
import { breakUpCompoundStatus } from '../server/app/utils/break-up-compound-status.js';

/**
 * @returns {Array} array of appeals that are in 'site_visit_booked' state which has passed inspection
 */
async function getAppealsWithPassedInspections() {
	const appeals = await appealRepository.getByStatusAndInspectionBeforeDate(
		'site_visit_booked',
		new Date()
	);

	return appeals;
}

/**
 * @param {Array} appeals appeal that need to be marked as 'decision_due'
 */
async function markAppealsAsDecisionDue(appeals) {
	const updatedAppeals = [];

	for (const appeal of appeals) {
		const nextState = transitionState(
			appeal.appealType.type,
			{ appealId: appeal.id },
			'site_visit_booked',
			'BOOKING_PASSED'
		);
		const newState = breakUpCompoundStatus(nextState.value, appeal.id);

		updatedAppeals.push(
			appealRepository.updateStatusById(appeal.id, newState, appeal.appealStatus)
		);
	}
	await Promise.all(updatedAppeals);
}

/**
 * Marks all appeals in the 'site_visit_booked' state with passed inspection with status 'decision_due'
 */
async function findAndUpdateStatusForAppealsWithPassedInspection() {
	const appeals = await getAppealsWithPassedInspections();

	await markAppealsAsDecisionDue(appeals);
}

await findAndUpdateStatusForAppealsWithPassedInspection();

export default findAndUpdateStatusForAppealsWithPassedInspection;
