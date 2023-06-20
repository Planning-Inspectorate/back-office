import { transitionState } from '../../../utils/transition-state.js';

const transitions = [['draft', 'START', 'pre_application', {}, true]];

test.each(transitions)(
	'Application State Machine: from state %O with action %O ' +
		'produces state %O with context %O and has changed: %O',
	(initialState, action, expectedState, context, hasChanged) => {
		const nextState = transitionState({
			caseType: 'application',
			context,
			status: initialState,
			machineAction: action
		});

		expect(nextState.value).toEqual(expectedState);
		expect(nextState.changed).toEqual(hasChanged);
	}
);
