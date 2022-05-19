import test from 'ava';
import sinon from 'sinon';
import inspectorActionsService from '../inspector.actions.js';
import lpaQuestionnaireActionsService from '../lpa-questionnaire-actions.service.js';
import { transitionState } from '../transition-state.js';

const lpaQuestionnaireStub = sinon.stub();
const inspectorSendBookingStub = sinon.stub();
const notifyAppellantOfDecisionStub = sinon.stub();

test.before('sets up mocking of actions', () => {
	sinon.stub(lpaQuestionnaireActionsService, 'sendLpaQuestionnaire').callsFake(lpaQuestionnaireStub);
	sinon.stub(inspectorActionsService, 'sendEmailToAppellantWithSiteVisitBooking').callsFake(inspectorSendBookingStub);
	sinon.stub(inspectorActionsService, 'sendEmailToLPAAndAppellantWithDeciion').callsFake(notifyAppellantOfDecisionStub);
});

/**
 * @param {object} t unit test
 * @param {string} initialState initial state in state machine
 * @param {string} action action taken to proceed in state machine
 * @param {string} expectedState expected state after action was taken
 * @param {object} context Context of transition
 * @param {boolean} hasChanged True if action was valid, False if action was invalid
 */
function applyAction(t, initialState, action, expectedState, context, hasChanged) {
	inspectorSendBookingStub.resetHistory();

	const nextState = transitionState('full planning', context, initialState, action);

	t.deepEqual(nextState.value, expectedState);
	t.is(nextState.changed, hasChanged);
	// if (nextState.value == 'awaiting_lpa_questionnaire') {
	// 	sinon.assert.calledWithExactly(lpaQuestionnaireStub, 1);
	// }
	// if (nextState.value == 'site_visit_booked') {
	// 	if (context.inspectionType == 'accompanied' || context.inspectionType == 'access required') {
	// 		sinon.assert.calledWithExactly(inspectorSendBookingStub, 1);
	// 	} else {
	// 		sinon.assert.notCalled(inspectorSendBookingStub);
	// 	}
	// }
	// if (nextState.value == 'appeal_decided') {
	// 	sinon.assert.calledWithExactly(notifyAppellantOfDecisionStub, 1, 'allowed');
	// }
}

const buildCompoundState = (lpaQuestionnaireAndInspectorPickupState, statementsAndFinalCommentsState) => {
	return { awaiting_lpa_questionnaire_and_statements: {
		lpaQuestionnaireAndInspectorPickup: lpaQuestionnaireAndInspectorPickupState,
		statementsAndFinalComments: statementsAndFinalCommentsState,
	}, };
};

applyAction.title = (initialState, action, expectedState, context,hasChanged, providedTitle = '') =>
	`Full Planning Appeal State Machine: ${providedTitle}: from state [${JSON.stringify(initialState)}]
	with context ${JSON.stringify(context)} action [${action}] produces state
	[${JSON.stringify(expectedState)}] ${hasChanged ? '' : ' without'} having transitioned`;

for (const parameter of [
	['received_appeal', 'INVALID', 'invalid_appeal', { appealId: 1 }, true],
	['received_appeal', 'VALID', buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, true],
	['received_appeal', 'INFO_MISSING', 'awaiting_validation_info', { appealId: 1 }, true],
	['awaiting_validation_info', 'INVALID', 'invalid_appeal', { appealId: 1 }, true],
	['awaiting_validation_info', 'INFO_MISSING', 'awaiting_validation_info', { appealId: 1 }, false],
	['awaiting_validation_info', 'VALID', buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, true],
	['invalid_appeal', 'INVALID', 'invalid_appeal', { appealId: 1 },],
	['invalid_appeal', 'INFO_MISSING', 'invalid_appeal', { appealId: 1 },],
	['invalid_appeal', 'VALID', 'invalid_appeal', { appealId: 1 },],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'INVALID',
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, false],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'OVERDUE',
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, true],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'RECEIVED',
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, true],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), 'RECEIVED',
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, true],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), 'COMPLETE',
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, false],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), 'INCOMPLETE',
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, false],
	[
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'), 'COMPLETE',
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'), { appealId: 1 }, true],
	[
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'), 'INCOMPLETE',
		buildCompoundState('incomplete_lpa_questionnaire', 'available_for_statements'), { appealId: 1 }, true],
	[
		buildCompoundState('incomplete_lpa_questionnaire', 'available_for_statements'), 'COMPLETE',
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'), { appealId: 1 }, true],
	[
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'), 'PICKUP',
		buildCompoundState('picked_up', 'available_for_statements'), { appealId: 1 }, true],
	[
		buildCompoundState('picked_up', 'available_for_statements'), 'BOOK',
		buildCompoundState('picked_up', 'available_for_statements'), { appealId: 1, inspectionType: 'accompanied' }, false],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'RECEIVED_STATEMENTS',
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_final_comments'), { appealId: 1 }, true],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'), 'DID_NOT_RECEIVE_STATEMENTS',
		buildCompoundState('awaiting_lpa_questionnaire', 'closed_for_statements_and_final_comments'), { appealId: 1 }, true],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_final_comments'), 'RECEIVED_FINAL_COMMENTS',
		buildCompoundState('awaiting_lpa_questionnaire', 'closed_for_statements_and_final_comments'), { appealId: 1 }, true],
	[
		buildCompoundState('available_for_inspector_pickup', 'closed_for_statements_and_final_comments'), 'PICKUP',
		'site_visit_not_yet_booked', { appealId: 1 }, true],
	[
		buildCompoundState('picked_up', 'available_for_final_comments'), 'RECEIVED_FINAL_COMMENTS',
		'site_visit_not_yet_booked', { appealId: 1 }, true],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', { appealId: 1, inspectionType: 'access required' }, true],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', { appealId: 1, inspectionType: 'unaccompanied' }, true],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', { appealId: 1, inspectionType: 'any other type' }, true],
	['site_visit_booked', 'BOOKING_PASSED', 'decision_due', { appealId: 1 }, true],
	['decision_due', 'DECIDE', 'appeal_decided', { appealId: 1, decision: 'allowed' }, true]
]) {
	test(applyAction, ...parameter);
}
