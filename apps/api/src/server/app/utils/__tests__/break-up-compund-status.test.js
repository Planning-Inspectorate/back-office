import test from 'ava';
import { breakUpCompoundStatus } from '../break-up-compound-status.js';

test('when appeal status is compound', (t) => {
	const result = breakUpCompoundStatus({
		awaiting_lpa_questionnaire_and_statements: {
			lpaQuestionnaireAndInspectorPickup: 'picked_up',
			statementsAndFinalComments: 'available_for_statements'
		}
	}, 1);

	t.deepEqual(result, [{
		compoundStateName: 'awaiting_lpa_questionnaire_and_statements',
		status: 'picked_up',
		subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
		appealId: 1
	}, {
		compoundStateName: 'awaiting_lpa_questionnaire_and_statements',
		status: 'available_for_statements',
		subStateMachineName: 'statementsAndFinalComments',
		appealId: 1
	}]);
});
