// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import sinon from 'sinon';
import transitionState from './household-appeal.machine.js';
import lpaQuestionnaireActions from './lpa-questionnaire.actions.js';

const lpaQuestionnaireStub = sinon.stub();

test.before('sets up mocking of actions', () => {
	sinon.stub(lpaQuestionnaireActions, 'sendLpaQuestionnaire').callsFake(lpaQuestionnaireStub);
});

const validateLPAQuestionnaireRowCreated = function(appealId) {
	sinon.assert.calledWithExactly(lpaQuestionnaireStub, appealId);
};

/**
 * @param {object} t unit test
 * @param {string} initial_state initial state in state machine
 * @param {string} action action taken to proceed in state machine
 * @param {string} expected_state expected state after action was taken
 * @param {boolean} has_changed True if action was valid, False if action was invalid
 * @param {functions} callback callback test
 */
function applyAction(t, initial_state, action, expected_state, has_changed, callback) {
	const next_state = transitionState(1, initial_state, action);
	t.is(next_state.value, expected_state);
	t.is(next_state.changed, has_changed);
	if (next_state.value == 'awaiting_lpa_questionnaire') {
		sinon.assert.calledWithExactly(lpaQuestionnaireStub, 1);
	}
}

applyAction.title = (providedTitle = '', initial_state, action, expected_state, has_changed) =>
	`${providedTitle}: from state [${initial_state}] action [${action}] produces state
	[${expected_state}] ${has_changed ? '' : ' without'} having transitioned`;

for (const parameter of [
	['received_appeal', 'INVALID', 'invalid_appeal', true],
	['received_appeal', 'VALID', 'awaiting_lpa_questionnaire', true, validateLPAQuestionnaireRowCreated],
	['received_appeal', 'INFO_MISSING', 'awaiting_validation_info', true],
	['awaiting_validation_info', 'INVALID', 'invalid_appeal', true],
	['awaiting_validation_info', 'INFO_MISSING', 'awaiting_validation_info', false],
	['awaiting_validation_info', 'VALID', 'awaiting_lpa_questionnaire', true, validateLPAQuestionnaireRowCreated],
	['invalid_appeal', 'INVALID', 'invalid_appeal', undefined],
	['invalid_appeal', 'INFO_MISSING', 'invalid_appeal', undefined],
	['invalid_appeal', 'VALID', 'invalid_appeal', undefined],
	['awaiting_lpa_questionnaire', 'INVALID', 'awaiting_lpa_questionnaire', false],
	['awaiting_lpa_questionnaire', 'INFO_MISSING', 'awaiting_lpa_questionnaire', false],
	['awaiting_lpa_questionnaire', 'VALID', 'awaiting_lpa_questionnaire', false],
	['awaiting_lpa_questionnaire', 'OVERDUE', 'overdue_lpa_questionnaire', true],
	['awaiting_lpa_questionnaire', 'RECEIVED', 'received_lpa_questionnaire', true],
	['overdue_lpa_questionnaire', 'RECEIVED', 'received_lpa_questionnaire', true],
	['overdue_lpa_questionnaire', 'COMPLETE', 'overdue_lpa_questionnaire', false],
	['overdue_lpa_questionnaire', 'INCOMPLETE', 'overdue_lpa_questionnaire', false],
	['received_lpa_questionnaire', 'COMPLETE', 'complete_lpa_questionnaire', true],
	['received_lpa_questionnaire', 'INCOMPLETE', 'incomplete_lpa_questionnaire', true],
	['incomplete_lpa_questionnaire', 'COMPLETE', 'complete_lpa_questionnaire', true],
]) {
	test(applyAction, ...parameter);
}
