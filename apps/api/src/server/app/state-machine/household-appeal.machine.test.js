// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import sinon from 'sinon';
import transitionState from './household-appeal.machine.js';
import investigatorActionsService from './investigator.actions.js';
import lpaQuestionnaireActions from './lpa-questionnaire.actions.js';

const lpaQuestionnaireStub = sinon.stub();
const investigatorSendBookingStub = sinon.stub();

test.before('sets up mocking of actions', () => {
	sinon.stub(lpaQuestionnaireActions, 'sendLpaQuestionnaire').callsFake(lpaQuestionnaireStub);
	sinon.stub(investigatorActionsService, 'sendEmailToAppellantWithSiteVisitBooking').callsFake(investigatorSendBookingStub);
});

/**
 * @param {object} t unit test
 * @param {string} initial_state initial state in state machine
 * @param {string} action action taken to proceed in state machine
 * @param {string} expected_state expected state after action was taken
 * @param {boolean} has_changed True if action was valid, False if action was invalid
 * @param {object} context Context of transition
 */
function applyAction(t, initial_state, action, expected_state, has_changed, context) {
	investigatorSendBookingStub.resetHistory();
	const next_state = transitionState(context, initial_state, action);
	t.is(next_state.value, expected_state);
	t.is(next_state.changed, has_changed);
	if (next_state.value == 'awaiting_lpa_questionnaire') {
		sinon.assert.calledWithExactly(lpaQuestionnaireStub, 1);
	}
	if (next_state.value == 'site_visit_booked') {
		if (context.inspectionType == 'accompanied' || context.inspectionType == 'access required') {
			sinon.assert.calledWithExactly(investigatorSendBookingStub, 1);
		} else {
			sinon.assert.notCalled(investigatorSendBookingStub);
		}
	}
}

applyAction.title = (providedTitle = '', initial_state, action, expected_state, has_changed, context) =>
	`${providedTitle}: from state [${initial_state}] with context ${JSON.stringify(context)} action [${action}] produces state
	[${expected_state}] ${has_changed ? '' : ' without'} having transitioned`;

for (const parameter of [
	['received_appeal', 'INVALID', 'invalid_appeal', true, { appealId: 1 }],
	['received_appeal', 'VALID', 'awaiting_lpa_questionnaire', true, { appealId: 1 }],
	['received_appeal', 'INFO_MISSING', 'awaiting_validation_info', true, { appealId: 1 }],
	['awaiting_validation_info', 'INVALID', 'invalid_appeal', true, { appealId: 1 }],
	['awaiting_validation_info', 'INFO_MISSING', 'awaiting_validation_info', false, { appealId: 1 }],
	['awaiting_validation_info', 'VALID', 'awaiting_lpa_questionnaire', true, { appealId: 1 }],
	['invalid_appeal', 'INVALID', 'invalid_appeal', undefined, { appealId: 1 }],
	['invalid_appeal', 'INFO_MISSING', 'invalid_appeal', undefined, { appealId: 1 }],
	['invalid_appeal', 'VALID', 'invalid_appeal', undefined, { appealId: 1 }],
	['awaiting_lpa_questionnaire', 'INVALID', 'awaiting_lpa_questionnaire', false, { appealId: 1 }],
	['awaiting_lpa_questionnaire', 'INFO_MISSING', 'awaiting_lpa_questionnaire', false, { appealId: 1 }],
	['awaiting_lpa_questionnaire', 'VALID', 'awaiting_lpa_questionnaire', false, { appealId: 1 }],
	['awaiting_lpa_questionnaire', 'OVERDUE', 'overdue_lpa_questionnaire', true, { appealId: 1 }],
	['awaiting_lpa_questionnaire', 'RECEIVED', 'received_lpa_questionnaire', true, { appealId: 1 }],
	['overdue_lpa_questionnaire', 'RECEIVED', 'received_lpa_questionnaire', true, { appealId: 1 }],
	['overdue_lpa_questionnaire', 'COMPLETE', 'overdue_lpa_questionnaire', false, { appealId: 1 }],
	['overdue_lpa_questionnaire', 'INCOMPLETE', 'overdue_lpa_questionnaire', false, { appealId: 1 }],
	['received_lpa_questionnaire', 'COMPLETE', 'available_for_investigator_pickup', true, { appealId: 1 }],
	['received_lpa_questionnaire', 'INCOMPLETE', 'incomplete_lpa_questionnaire', true, { appealId: 1 }],
	['incomplete_lpa_questionnaire', 'COMPLETE', 'available_for_investigator_pickup', true, { appealId: 1 }],
	['available_for_investigator_pickup', 'PICKUP', 'site_visit_not_yet_booked', true, { appealId: 1 }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'accompanied' }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'access required' }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'any other type' }]
]) {
	test(applyAction, ...parameter);
}
