import { createMachine, interpret } from 'xstate';
import { generateValidationStates } from './validation-states.js';
import { generateLpaQuestionnaireStates } from './lpa-questionnaire-states.js';
import { inspectorBookingStates, generateInspectorPickupStates } from './inspector-states.js'

const validationStates = generateValidationStates('awaiting_lpa_questionnaire_and_statements');

const lpaQuestionnaireStates = generateLpaQuestionnaireStates();

const inspectorPickupStates = generateInspectorPickupStates('picked_up', { picked_up: { type: 'final' } });

const lpaQuestionnaireWithExtrasStates = {
	initial: 'awaiting_lpa_questionnaire',
	states: {
		...lpaQuestionnaireStates,
		...inspectorPickupStates
	},
};

const statementsAndFinalCommentsStates = {
	initial: 'available_for_statements',
	states: {
		available_for_statements: {
			on: {
				RECEIVED_STATEMENTS: 'available_for_final_comments',
				DID_NOT_RECEIVE_STATEMENTS: 'closed_for_statements_and_final_comments',
			},
		},
		available_for_final_comments: {
			on: {
				RECEIVED_FINAL_COMMENTS: 'closed_for_statements_and_final_comments',
			},
		},
		closed_for_statements_and_final_comments: {
			type: 'final',
		},
	},
};

const lpaQuestionnaireAndStatementsStates = {
	awaiting_lpa_questionnaire_and_statements: {
		type: 'parallel',
		states: {
			lpaQuestionnaire: lpaQuestionnaireWithExtrasStates,
			statementsAndFinalComments: statementsAndFinalCommentsStates,
		},
		onDone: 'site_visit_not_yet_booked',
	},
};

const createFullPlanningAppealMachine = function (context) {
	return createMachine({
		id: 'full_planning_appeal',
		context: context,
		initial: 'received_appeal',
		states: {
			...validationStates,
			...lpaQuestionnaireAndStatementsStates,
			...inspectorBookingStates,
		},
	});
};

export { createFullPlanningAppealMachine };
