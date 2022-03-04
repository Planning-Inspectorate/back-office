'use strict';

const { createMachine } = require("xstate");

const validation_states = {
	submitted: {
		on: {
			INVALID: 'invalid',
			INFO_MISSING: 'awaiting_validation_info',
			VALID: 'with_case_officer'
		}
	},
	invalid: {
		type: 'final'
	},
	awaiting_validation_info: {
		entry: ["notifyAppellantOfMissingAppealInfo"],
		on: {
			INVALID: 'invalid',
			VALID: 'with_case_officer'
		}
	},
};

const validation_actions = {
	notifyAppellantOfMissingAppealInfo: (context, event) => {
		console.log('Letting Appellant know that info is missing...');
	}
};

const case_manager_states = {
	with_case_officer: {
		entry: ["assignCaseManagerTeam", "sendAppealStartedDetails"],
		on: {
			COMPLETE_QUESTIONNAIRE_RECEIVED: "with_inspector",
			INCOMPLETE_QUESTIONNAIRE_RECEIVE: "awaiting_complete_questionnaire"
		}
	},
	awaiting_complete_questionnaire: {
		on: {
			COMPLETE_QUESTIONNAIRE_RECEIVED: "with_inspector"
		}
	},
	with_inspector: {}
}

const case_manager_actions = {
	assignCaseManagerTeam: (context, event) => {
		console.log('Assigning Case Manager Team');
	},
	sendAppealStartedDetails: (context, event) => {
		console.log('Send Appeal Started Details');
	}
}

const housing_appeal_machine = createMachine({
	id: "housing_appeal",
	initial: "submitted",
	states: {
		...validation_states,
		...case_manager_states
	},
	actions: {
		...validation_actions,
		...case_manager_actions
	}
});

module.exports = housing_appeal_machine;

