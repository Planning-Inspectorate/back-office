import sinon from 'sinon';
import { transitionState } from '../../../utils/transition-state.js';
import inspectorActionsService from '../inspector.actions.js';
import lpaQuestionnaireActionsService from '../lpa-questionnaire-actions.service.js';

const lpaQuestionnaireStub = sinon.stub();
const inspectorSendBookingStub = sinon.stub();
const notifyAppellantOfDecisionStub = sinon.stub();

const buildCompoundState = (
	lpaQuestionnaireAndInspectorPickupState,
	statementsAndFinalCommentsState
) => {
	return {
		awaiting_lpa_questionnaire_and_statements: {
			lpaQuestionnaireAndInspectorPickup: lpaQuestionnaireAndInspectorPickupState,
			statementsAndFinalComments: statementsAndFinalCommentsState
		}
	};
};

const transitions = [
	['received_appeal', 'INVALID', 'invalid_appeal', { appealId: 1 }, true],
	[
		'received_appeal',
		'VALID',
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	['received_appeal', 'INFO_MISSING', 'awaiting_validation_info', { appealId: 1 }, true],
	['awaiting_validation_info', 'INVALID', 'invalid_appeal', { appealId: 1 }, true],
	['awaiting_validation_info', 'INFO_MISSING', 'awaiting_validation_info', { appealId: 1 }, false],
	[
		'awaiting_validation_info',
		'VALID',
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	['invalid_appeal', 'INVALID', 'invalid_appeal', { appealId: 1 }, undefined],
	['invalid_appeal', 'INFO_MISSING', 'invalid_appeal', { appealId: 1 }, undefined],
	['invalid_appeal', 'VALID', 'invalid_appeal', { appealId: 1 }, undefined],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'),
		'INVALID',
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		false
	],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'),
		'OVERDUE',
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'),
		'RECEIVED',
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'),
		'RECEIVED',
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'),
		'COMPLETE',
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		false
	],
	[
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'),
		'INCOMPLETE',
		buildCompoundState('overdue_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		false
	],
	[
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'),
		'COMPLETE',
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('received_lpa_questionnaire', 'available_for_statements'),
		'INCOMPLETE',
		buildCompoundState('incomplete_lpa_questionnaire', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('incomplete_lpa_questionnaire', 'available_for_statements'),
		'COMPLETE',
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('available_for_inspector_pickup', 'available_for_statements'),
		'PICKUP',
		buildCompoundState('picked_up', 'available_for_statements'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('picked_up', 'available_for_statements'),
		'BOOK',
		buildCompoundState('picked_up', 'available_for_statements'),
		{ appealId: 1, inspectionType: 'accompanied' },
		false
	],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'),
		'RECEIVED_STATEMENTS',
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_final_comments'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_statements'),
		'DID_NOT_RECEIVE_STATEMENTS',
		buildCompoundState('awaiting_lpa_questionnaire', 'closed_for_statements_and_final_comments'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('awaiting_lpa_questionnaire', 'available_for_final_comments'),
		'RECEIVED_FINAL_COMMENTS',
		buildCompoundState('awaiting_lpa_questionnaire', 'closed_for_statements_and_final_comments'),
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState(
			'available_for_inspector_pickup',
			'closed_for_statements_and_final_comments'
		),
		'PICKUP',
		'site_visit_not_yet_booked',
		{ appealId: 1 },
		true
	],
	[
		buildCompoundState('picked_up', 'available_for_final_comments'),
		'RECEIVED_FINAL_COMMENTS',
		'site_visit_not_yet_booked',
		{ appealId: 1 },
		true
	],
	[
		'site_visit_not_yet_booked',
		'BOOK',
		'site_visit_booked',
		{ appealId: 1, inspectionType: 'access required' },
		true
	],
	[
		'site_visit_not_yet_booked',
		'BOOK',
		'site_visit_booked',
		{ appealId: 1, inspectionType: 'unaccompanied' },
		true
	],
	[
		'site_visit_not_yet_booked',
		'BOOK',
		'site_visit_booked',
		{ appealId: 1, inspectionType: 'any other type' },
		true
	],
	['site_visit_booked', 'BOOKING_PASSED', 'decision_due', { appealId: 1 }, true],
	['decision_due', 'DECIDE', 'appeal_decided', { appealId: 1, decision: 'allowed' }, true]
];

describe('Full Planning Appeal', () => {
	beforeAll(() => {
		sinon
			.stub(lpaQuestionnaireActionsService, 'sendLpaQuestionnaire')
			.callsFake(lpaQuestionnaireStub);
		sinon
			.stub(inspectorActionsService, 'sendEmailToAppellantWithSiteVisitBooking')
			.callsFake(inspectorSendBookingStub);
		sinon
			.stub(inspectorActionsService, 'sendEmailToLPAAndAppellantWithDeciion')
			.callsFake(notifyAppellantOfDecisionStub);
	});

	test.each(transitions)(
		'Full Planning Appeal State Machine: from state %O with action %O ' +
			'produces state %O with context %O and has changed: %O',
		(initialState, action, expectedState, context, hasChanged) => {
			const nextState = transitionState({
				caseType: 'full planning',
				context,
				status: initialState,
				machineAction: action,
				throwError: false
			});

			expect(nextState.value).toEqual(expectedState);
			expect(nextState.changed).toEqual(hasChanged);
		}
	);
});
