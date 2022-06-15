import { createMachine } from 'xstate';
import mapObjectKeysToStrings from '../../utils/map-states-to-strings.js';
import { inspectorActions, inspectorStates } from './inspector-states.js';
import lpaQuestionnaireActions from './lpa-questionnaire-actions.js';
import { generateLpaQuestionnaireStates } from './lpa-questionnaire-states.js';
import { generateValidationStates, validationActions } from './validation-states.js';

const validationStates = generateValidationStates('awaiting_lpa_questionnaire');
const lpaQuestionnaireStates = generateLpaQuestionnaireStates();

const createHouseholpAppealMachine = (context) => {
	return createMachine(
		{
			id: 'household_appeal',
			context,
			initial: 'received_appeal',
			states: {
				...validationStates,
				...lpaQuestionnaireStates,
				...inspectorStates
			}
		},
		{
			actions: {
				...validationActions,
				...lpaQuestionnaireActions,
				...inspectorActions
			}
		}
	);
};

const householdStates = {
	...mapObjectKeysToStrings(validationStates),
	...mapObjectKeysToStrings(lpaQuestionnaireStates),
	...mapObjectKeysToStrings(inspectorStates)
};

export { createHouseholpAppealMachine, householdStates };
