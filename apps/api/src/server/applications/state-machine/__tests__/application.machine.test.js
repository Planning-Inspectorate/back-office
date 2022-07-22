import test from 'ava';
import { transitionState } from '../../../utils/transition-state.js';

/**
 * @param {object} t
 * @param {{initialState: string, action: string, expectedState: string, context: object, hasChanged: boolean}} config
 */
function applyAction(t, { initialState, action, expectedState, context, hasChanged }) {
	const nextState = transitionState({
		caseType: 'application',
		context,
		status: initialState,
		machineAction: action
	});

	t.deepEqual(nextState.value, expectedState);
	t.is(nextState.changed, hasChanged);
}

applyAction.title = (providedTitle, { initialState, action, expectedState, context, hasChanged }) =>
	`Application State Machine: ${providedTitle}: from state [${JSON.stringify(initialState)}]
	with context ${JSON.stringify(context)} action [${action}] produces state
	[${JSON.stringify(expectedState)}] ${hasChanged ? '' : ' without'} having transitioned`;

for (const parameter of [['draft', 'START', 'pre_application', {}, true]]) {
	test(applyAction, {
		initialState: parameter[0],
		action: parameter[1],
		expectedState: parameter[2],
		context: parameter[3],
		hasChanged: parameter[4]
	});
}
