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
 * @param {boolean} hasChanged True if action was valid, False if action was invalid
 * @param {object} context Context of transition
 */
function applyAction(t, initialState, action, expectedState, hasChanged, context) {
	inspectorSendBookingStub.resetHistory();

	const nextState = transitionState('household', context, initialState, action);

	t.is(nextState.value, expectedState);
	t.is(nextState.changed, hasChanged);
	if (nextState.value === 'awaiting_lpa_questionnaire') {
		sinon.assert.calledWithExactly(lpaQuestionnaireStub, 1);
	}
	if (nextState.value === 'site_visit_booked') {
		if (context.inspectionType === 'accompanied' || context.inspectionType === 'access required') {
			sinon.assert.calledWithExactly(inspectorSendBookingStub, 1);
		} else {
			sinon.assert.notCalled(inspectorSendBookingStub);
		}
	}
	if (nextState.value === 'appeal_decided') {
		sinon.assert.calledWithExactly(notifyAppellantOfDecisionStub, 1, 'allowed');
	}
}

applyAction.title = (initialState, action, expectedState, hasChanged, context, providedTitle = '') =>
	`${providedTitle}: from state [${initialState}] with context ${JSON.stringify(context)} action [${action}] produces state
	[${expectedState}] ${hasChanged ? '' : ' without'} having transitioned`;

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
	['received_lpa_questionnaire', 'COMPLETE', 'available_for_inspector_pickup', true, { appealId: 1 }],
	['received_lpa_questionnaire', 'INCOMPLETE', 'incomplete_lpa_questionnaire', true, { appealId: 1 }],
	['incomplete_lpa_questionnaire', 'COMPLETE', 'available_for_inspector_pickup', true, { appealId: 1 }],
	['available_for_inspector_pickup', 'PICKUP', 'site_visit_not_yet_booked', true, { appealId: 1 }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'accompanied' }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'access required' }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'unaccompanied' }],
	['site_visit_not_yet_booked', 'BOOK', 'site_visit_booked', true, { appealId: 1, inspectionType: 'any other type' }],
	['site_visit_booked', 'BOOKING_PASSED', 'decision_due', true, { appealId: 1 }],
	['decision_due', 'DECIDE', 'appeal_decided', true, { appealId: 1, decision: 'allowed' }]
]) {
	test(applyAction, ...parameter);
}
