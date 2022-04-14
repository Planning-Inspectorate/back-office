// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import sinon from 'sinon';
import { transitionState } from './transition-state.js';
import inspectorActionsService from './inspector.actions.js';
import lpaQuestionnaireActions from './lpa-questionnaire.actions.js';

const lpaQuestionnaireStub = sinon.stub();
const inspectorSendBookingStub = sinon.stub();
const notifyAppellantOfDecisionStub = sinon.stub();

test.before('sets up mocking of actions', () => {
	sinon.stub(lpaQuestionnaireActions, 'sendLpaQuestionnaire').callsFake(lpaQuestionnaireStub);
	sinon.stub(inspectorActionsService, 'sendEmailToAppellantWithSiteVisitBooking').callsFake(inspectorSendBookingStub);
	sinon.stub(inspectorActionsService, 'sendEmailToLPAAndAppellantWithDeciion').callsFake(notifyAppellantOfDecisionStub);
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
	inspectorSendBookingStub.resetHistory();
	const next_state = transitionState('full planning', context, initial_state, action);
	t.deepEqual(next_state.value, expected_state);
	t.is(next_state.changed, has_changed);
	// if (next_state.value == 'awaiting_lpa_questionnaire') {
	// 	sinon.assert.calledWithExactly(lpaQuestionnaireStub, 1);
	// }
	// if (next_state.value == 'site_visit_booked') {
	// 	if (context.inspectionType == 'accompanied' || context.inspectionType == 'access required') {
	// 		sinon.assert.calledWithExactly(inspectorSendBookingStub, 1);
	// 	} else {
	// 		sinon.assert.notCalled(inspectorSendBookingStub);
	// 	}
	// }
	// if (next_state.value == 'appeal_decided') {
	// 	sinon.assert.calledWithExactly(notifyAppellantOfDecisionStub, 1, 'allowed');
	// }
}

const buildCompoundState = function(lpaQuestionnaireState, statementsAndFinalCommentsState) {
	return { awaiting_lpa_questionnaire_and_statements: {
		lpaQuestionnaire: lpaQuestionnaireState,
		statementsAndFinalComments: statementsAndFinalCommentsState,
	}, };
};

applyAction.title = (providedTitle = '', initial_state, action, expected_state, has_changed, context) =>
	`Full Planning Appeal State Machine: ${providedTitle}: from state [${JSON.stringify(initial_state)}] 
	with context ${JSON.stringify(context)} action [${action}] produces state
	[${JSON.stringify(expected_state)}] ${has_changed ? '' : ' without'} having transitioned`;

for (const parameter of [
	['received_appeal', 'INVALID', 'invalid_appeal', true, { appealId: 1 }],
	['received_appeal', 'VALID', buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), true, { appealId: 1 }],
	['received_appeal', 'INFO_MISSING', 'awaiting_validation_info', true, { appealId: 1 }],
	['awaiting_validation_info', 'INVALID', 'invalid_appeal', true, { appealId: 1 }],
	['awaiting_validation_info', 'INFO_MISSING', 'awaiting_validation_info', false, { appealId: 1 }],
	['awaiting_validation_info', 'VALID', buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), true, { appealId: 1 }],
	['invalid_appeal', 'INVALID', 'invalid_appeal', undefined, { appealId: 1 }],
	['invalid_appeal', 'INFO_MISSING', 'invalid_appeal', undefined, { appealId: 1 }],
	['invalid_appeal', 'VALID', 'invalid_appeal', undefined, { appealId: 1 }],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'INVALID', 
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), false, { appealId: 1 }],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'OVERDUE', 
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), true, { appealId: 1 }],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'RECEIVED', 
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'), true, { appealId: 1 }],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), 'RECEIVED', 
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'), true, { appealId: 1 }],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), 'COMPLETE', 
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), false, { appealId: 1 }],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), 'INCOMPLETE', 
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), false, { appealId: 1 }],
	[
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'), 'COMPLETE', 
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'), true, { appealId: 1 }],
	[
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'), 'INCOMPLETE', 
		buildCompoundState('incomplete_lpa_questionnaire', 'available_for_statements'), true, { appealId: 1 }],
	[
		buildCompoundState('incomplete_lpa_questionnaire', 'available_for_statements'), 'COMPLETE', 
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'), true, { appealId: 1 }],
	[
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'), 'PICKUP', 
		buildCompoundState('picked_up', 'available_for_statements'), true, { appealId: 1 }],
	[
		buildCompoundState('picked_up', 'available_for_statements'), 'BOOK', 
		buildCompoundState('picked_up', 'available_for_statements'), false, { appealId: 1, inspectionType: 'accompanied' }],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'RECEIVED_STATEMENTS', 
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_final_comments'), true, { appealId: 1 }],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'DID_NOT_RECEIVE_STATEMENTS', 
		buildCompoundState('awaiting_lpa_questionnaire', 'closed_for_statements_and_final_comments'), true, { appealId: 1 }],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_final_comments'), 'RECEIVED_FINAL_COMMENTS', 
		buildCompoundState('awaiting_lpa_questionnaire', 'closed_for_statements_and_final_comments'), true, { appealId: 1 }],
	[
		buildCompoundState('available_for_inspector_pickup', 'closed_for_statements_and_final_comments'), 'PICKUP', 
		'site_visit_not_yet_booked', true, { appealId: 1 }],
	[
		buildCompoundState('picked_up', 'available_for_final_comments'), 'RECEIVED_FINAL_COMMENTS', 
		'site_visit_not_yet_booked', true, { appealId: 1 }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'access required' }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'unaccompanied' }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'any other type' }],
	['site_visit_booked', 'BOOKING_PASSED', 'decision_due', true, { appealId: 1 }],
	['decision_due', 'DECIDE', 'appeal_decided', true, { appealId: 1, decision: 'allowed' }]
]) {
	test(applyAction, ...parameter);
}
