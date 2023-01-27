import sinon from 'sinon';
import { transitionState } from '../../../utils/transition-state.js';
import inspectorActionsService from '../inspector.actions.js';
import lpaQuestionnaireActionsService from '../lpa-questionnaire-actions.service.js';

const lpaQuestionnaireStub = sinon.stub();
const inspectorSendBookingStub = sinon.stub();
const notifyAppellantOfDecisionStub = sinon.stub();

const transitions = [
	['received_appeal', 'INVALID', 'invalid_appeal', { appealId: 1 }, true],
	['received_appeal', 'VALID', 'awaiting_lpa_questionnaire', { appealId: 1 }, true],
	['received_appeal', 'INFO_MISSING', 'awaiting_validation_info', { appealId: 1 }, true],
	['awaiting_validation_info', 'INVALID', 'invalid_appeal', { appealId: 1 }, true],
	['awaiting_validation_info', 'INFO_MISSING', 'awaiting_validation_info', { appealId: 1 }, false],
	['awaiting_validation_info', 'VALID', 'awaiting_lpa_questionnaire', { appealId: 1 }, true],
	['invalid_appeal', 'INVALID', 'invalid_appeal', { appealId: 1 }, undefined],
	['invalid_appeal', 'INFO_MISSING', 'invalid_appeal', { appealId: 1 }, undefined],
	['invalid_appeal', 'VALID', 'invalid_appeal', { appealId: 1 }, undefined],
	['awaiting_lpa_questionnaire', 'INVALID', 'awaiting_lpa_questionnaire', { appealId: 1 }, false],
	[
		'awaiting_lpa_questionnaire',
		'INFO_MISSING',
		'awaiting_lpa_questionnaire',
		{ appealId: 1 },
		false
	],
	['awaiting_lpa_questionnaire', 'VALID', 'awaiting_lpa_questionnaire', { appealId: 1 }, false],
	['awaiting_lpa_questionnaire', 'OVERDUE', 'overdue_lpa_questionnaire', { appealId: 1 }, true],
	['awaiting_lpa_questionnaire', 'RECEIVED', 'received_lpa_questionnaire', { appealId: 1 }, true],
	['overdue_lpa_questionnaire', 'RECEIVED', 'received_lpa_questionnaire', { appealId: 1 }, true],
	['overdue_lpa_questionnaire', 'COMPLETE', 'overdue_lpa_questionnaire', { appealId: 1 }, false],
	['overdue_lpa_questionnaire', 'INCOMPLETE', 'overdue_lpa_questionnaire', { appealId: 1 }, false],
	[
		'received_lpa_questionnaire',
		'COMPLETE',
		'available_for_inspector_pickup',
		{ appealId: 1 },
		true
	],
	[
		'received_lpa_questionnaire',
		'INCOMPLETE',
		'incomplete_lpa_questionnaire',
		{ appealId: 1 },
		true
	],
	[
		'incomplete_lpa_questionnaire',
		'COMPLETE',
		'available_for_inspector_pickup',
		{ appealId: 1 },
		true
	],
	['available_for_inspector_pickup', 'PICKUP', 'site_visit_not_yet_booked', { appealId: 1 }, true],
	[
		'site_visit_not_yet_booked',
		'BOOK',
		'site_visit_booked',
		{ appealId: 1, inspectionType: 'accompanied' },
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

describe('Household Appeal', () => {
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

	beforeEach(() => {
		inspectorSendBookingStub.resetHistory();
		lpaQuestionnaireStub.resetHistory();
		notifyAppellantOfDecisionStub.resetHistory();
	});

	test.each(transitions)(
		'Household Appeal State Machine: from state %O with action %O ' +
			'produces state %O with context %O and has changed: %O',
		(initialState, action, expectedState, context, hasChanged) => {
			const nextState = transitionState({
				caseType: 'household',
				context,
				status: initialState,
				machineAction: action,
				throwError: false
			});

			expect(nextState.value).toEqual(expectedState);
			expect(nextState.changed).toEqual(hasChanged);

			// TODO: fix this test
			// if (nextState.value === 'awaiting_lpa_questionnaire') {
			// 	sinon.assert.calledWithExactly(lpaQuestionnaireStub, 1);
			// }
			if (nextState.value === 'site_visit_booked') {
				if (
					context.inspectionType === 'accompanied' ||
					context.inspectionType === 'access required'
				) {
					sinon.assert.calledWithExactly(inspectorSendBookingStub, 1);
				} else {
					sinon.assert.notCalled(inspectorSendBookingStub);
				}
			}
			if (nextState.value === 'appeal_decided') {
				sinon.assert.calledWithExactly(notifyAppellantOfDecisionStub, 1, 'allowed');
			}
		}
	);
});
