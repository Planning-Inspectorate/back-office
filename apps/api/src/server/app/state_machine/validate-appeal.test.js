// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import machine from './household-appeal.machine.js';

test('should have \'submitted\' as initial state', (t) => {
	const initial_state = machine.initialState;
	t.is(initial_state.value, 'submitted');
});

/**
 * @param {object} t unit test
 * @param {string} initial_state initial state in state machine
 * @param {string} action action taken to proceed in state machine
 * @param {string} expected_state expected state after action was taken
 * @param {boolean} has_changed True if action was valid, False if action was invalid
 */
function applyAction(t, initial_state, action, expected_state, has_changed) {
	const next_state = machine.transition(initial_state, action);
	t.is(next_state.value, expected_state);
	t.is(next_state.changed, has_changed);
}

applyAction.title = (providedTitle = '', initial_state, action, expected_state, has_changed) =>
	`${providedTitle}: from state [${initial_state}] action [${action}] produces state
	[${expected_state}] ${has_changed ? '' : ' without'} having transitioned`;

for (const parameter of [
	['submitted', 'INVALID', 'invalid', true],
	['submitted', 'VALID', 'with_case_officer', true],
	['submitted', 'INFO_MISSING', 'awaiting_validation_info', true],
	['awaiting_validation_info', 'INVALID', 'invalid', true],
	['awaiting_validation_info', 'INFO_MISSING', 'awaiting_validation_info', false],
	['awaiting_validation_info', 'VALID', 'with_case_officer', true],
	['invalid', 'INVALID', 'invalid', false],
	['invalid', 'INFO_MISSING', 'invalid', false],
	['invalid', 'VALID', 'invalid', false],
	['with_case_officer', 'INVALID', 'with_case_officer', false],
	['with_case_officer', 'INFO_MISSING', 'with_case_officer', false],
	['with_case_officer', 'VALID', 'with_case_officer', false],
]) {
	test(applyAction, ...parameter);
}
