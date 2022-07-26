import * as caseRepository from '../../repositories/case.repository.js';
import { breakUpCompoundStatus } from '../../utils/break-up-compound-status.js';
import { mapCaseStatus } from '../../utils/mapping/map-case-status.js';
import { transitionState } from '../../utils/transition-state.js';

/**
 * @param {number} id
 * @returns {Promise<{id: number, reference: string, status: import('xstate').StateValue}>}
 */
export const startApplication = async (id) => {
	const caseDetails = await caseRepository.getById(id);

	// TODO: verify that all the application details are present and in the expected state

	const applicationStatus = mapCaseStatus(caseDetails?.CaseStatus);

	const nextStatusInStateMachine = transitionState({
		caseType: 'application',
		status: applicationStatus,
		machineAction: 'START'
	});

	const nextStatusForRepository = breakUpCompoundStatus(
		nextStatusInStateMachine.value,
		caseDetails.id
	);

	const reference = 'some new reference';

	await caseRepository.updateApplicationStatusAndDataById(
		caseDetails.id,
		nextStatusForRepository,
		{ reference },
		caseDetails.CaseStatus
	);

	return { id, reference, status: nextStatusInStateMachine.value };
};
