// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import household_appeal_machine from './household-appeal.machine.js';

test('should have \'submitted\' as initial state', (t) => {
	const initial_state = household_appeal_machine.initialState;
	t.is(initial_state.value, 'received_appeal');
});

/**
 * @param {object} t unit test
 * @param {string} initial_state initial state in state machine
 * @param {string} action action taken to proceed in state machine
 * @param {string} expected_state expected state after action was taken
 * @param {boolean} has_changed True if action was valid, False if action was invalid
 */
function applyAction(t, initial_state, action, expected_state, has_changed) {
	const next_state = household_appeal_machine.transition(initial_state, action);
	t.is(next_state.value, expected_state);
	t.is(next_state.changed, has_changed);
}

applyAction.title = (providedTitle = '', initial_state, action, expected_state, has_changed) =>
	`${providedTitle}: from state [${initial_state}] action [${action}] produces state
	[${expected_state}] ${has_changed ? '' : ' without'} having transitioned`;

for (const parameter of [
	['received_appeal', 'INVALID', 'invalid_appeal', true],
	['received_appeal', 'VALID', 'awaiting_lpa_questionnaire', true],
	['received_appeal', 'INFO_MISSING', 'awaiting_validation_info', true],
	['awaiting_validation_info', 'INVALID', 'invalid_appeal', true],
	['awaiting_validation_info', 'INFO_MISSING', 'awaiting_validation_info', false],
	['awaiting_validation_info', 'VALID', 'awaiting_lpa_questionnaire', true],
	['invalid_appeal', 'INVALID', 'invalid_appeal', false],
	['invalid_appeal', 'INFO_MISSING', 'invalid_appeal', false],
	['invalid_appeal', 'VALID', 'invalid_appeal', false],
	['awaiting_lpa_questionnaire', 'INVALID', 'awaiting_lpa_questionnaire', false],
	['awaiting_lpa_questionnaire', 'INFO_MISSING', 'awaiting_lpa_questionnaire', false],
	['awaiting_lpa_questionnaire', 'VALID', 'awaiting_lpa_questionnaire', false],
	['awaiting_lpa_questionnaire', 'OVERDUE', 'overdue_lpa_questionnaire', true],
	['awaiting_lpa_questionnaire', 'RECEIVED', 'received_lpa_questionnaire', true]
]) {
	test(applyAction, ...parameter);
}
