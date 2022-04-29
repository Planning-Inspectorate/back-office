import { createMachine } from 'xstate';
import { generateValidationStates } from './validation-states.js';
import { generateLpaQuestionnaireStates } from './lpa-questionnaire-states.js';
import { inspectorBookingStates, generateInspectorPickupStates } from './inspector-states.js';
import { statementsAndFinalCommentsStates } from './statements-and-final-comments-states.js';
import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';

const validationStates = generateValidationStates('awaiting_lpa_questionnaire_and_statements');
const lpaQuestionnaireStates = generateLpaQuestionnaireStates();
const inspectorPickupStates = generateInspectorPickupStates('picked_up', { picked_up: { type: 'final' } });

const lpaQuestionnaireWithInspectorPickupStates = {
	initial: 'awaiting_lpa_questionnaire',
	states: {
		...lpaQuestionnaireStates,
		...inspectorPickupStates
	},
};


const lpaQuestionnaireAndStatementsStates = {
	awaiting_lpa_questionnaire_and_statements: {
		type: 'parallel',
		states: {
			lpaQuestionnaireAndInspectorPickup: lpaQuestionnaireWithInspectorPickupStates,
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

const fullPlanningStates = {
	...mapObjectKeysToStrings(validationStates),
	...mapObjectKeysToStrings(lpaQuestionnaireWithInspectorPickupStates.states),
	...mapObjectKeysToStrings(statementsAndFinalCommentsStates.states),
	...mapObjectKeysToStrings(inspectorBookingStates),
};

const weeksReceivingDocuments = {
	statements: 5,
	finalComments: 2
};

export { createFullPlanningAppealMachine, fullPlanningStates, weeksReceivingDocuments };
