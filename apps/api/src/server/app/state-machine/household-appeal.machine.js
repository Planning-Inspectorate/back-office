import { createMachine } from 'xstate';
import { generateValidationStates, validationActions } from './validation-states.js';
import { generateLpaQuestionnaireStates } from './lpa-questionnaire-states.js';
import lpaQuestionnaireActions from './lpa-questionnaire-actions.js';
import { inspectorStates, inspectorActions } from './inspector-states.js';
import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';

const validationStates = generateValidationStates('awaiting_lpa_questionnaire');
const validationStatesStrings = mapObjectKeysToStrings(validationStates);

const lpaQuestionnaireStates = generateLpaQuestionnaireStates();
const lpaQuestionnaireStatesStrings = mapObjectKeysToStrings(lpaQuestionnaireStates);

const createHouseholpAppealMachine = function (context) {
	return createMachine({
		id: 'household_appeal',
		context: context,
		initial: 'received_appeal',
		states: {
			...validationStates,
			...lpaQuestionnaireStates,
			...inspectorStates
		},
	}, {
		actions: {
			...validationActions,
			...lpaQuestionnaireActions,
			...inspectorActions
		}
	});
};

export { createHouseholpAppealMachine, validationStates, validationStatesStrings, lpaQuestionnaireStatesStrings };
