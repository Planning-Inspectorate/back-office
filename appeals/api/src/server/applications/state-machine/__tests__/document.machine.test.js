import { transitionState } from '../../../utils/transition-state.js';

const transitions = [
	['awaiting_upload', 'uploading', 'awaiting_virus_check', {}, true],
	['awaiting_upload', 'check_fail', 'awaiting_upload', {}, false],
	['awaiting_upload', 'check_success', 'awaiting_upload', {}, false],
	['awaiting_virus_check', 'check_fail', 'failed_virus_check', {}, true],
	['awaiting_virus_check', 'check_success', 'not_user_checked', {}, true],
	['awaiting_virus_check', 'uploading', 'awaiting_virus_check', {}, false]
];

test.each(transitions)(
	'Application State Machine: from state %O with action %O ' +
		'produces state %O with context %O and has changed: %O',
	(initialState, action, expectedState, context, hasChanged) => {
		const nextState = transitionState({
			caseType: 'document',
			context,
			status: initialState,
			machineAction: action
		});

		expect(nextState.value).toEqual(expectedState);
		expect(nextState.changed).toEqual(hasChanged);
	}
);
