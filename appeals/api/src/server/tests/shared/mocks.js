import {
	VALIDATION_OUTCOME_COMPLETE,
	VALIDATION_OUTCOME_INCOMPLETE,
	VALIDATION_OUTCOME_INVALID,
	VALIDATION_OUTCOME_VALID
} from '#endpoints/constants.js';

const lookupListData = [
	{
		id: 1,
		name: 'Value 1'
	},
	{
		id: 2,
		name: 'Value 2'
	},
	{
		id: 3,
		name: 'Other'
	}
];

export const auditTrails = lookupListData;
export const appellantCaseIncompleteReasons = lookupListData;
export const appellantCaseInvalidReasons = lookupListData;
export const lpaQuestionnaireIncompleteReasons = lookupListData;
export const knowledgeOfOtherLandowners = lookupListData;
export const lpaNotificationMethods = lookupListData;
export const planningObligationStatuses = lookupListData;
export const procedureTypes = lookupListData;
export const scheduleTypes = lookupListData;
export const siteVisitTypes = lookupListData;
export const documentRedactionStatuses = lookupListData;
export const documentRedactionStatusIds = documentRedactionStatuses.map(({ id }) => id);
export const azureAdUserId = '6f930ec9-7f6f-448c-bb50-b3b898035959';

export const designatedSites = [
	{
		description: 'Site 1',
		id: 1,
		name: 'Site 1'
	},
	{
		description: 'Site 2',
		id: 2,
		name: 'Site 2'
	}
];

export const appellantCaseValidationOutcomes = [
	{
		id: 1,
		name: VALIDATION_OUTCOME_INCOMPLETE
	},
	{
		id: 2,
		name: VALIDATION_OUTCOME_INVALID
	},
	{
		id: 3,
		name: VALIDATION_OUTCOME_VALID
	}
];

export const lpaQuestionnaireValidationOutcomes = [
	{
		id: 1,
		name: VALIDATION_OUTCOME_COMPLETE
	},
	{
		id: 2,
		name: VALIDATION_OUTCOME_INCOMPLETE
	}
];

export const validAppellantCaseOutcome = {
	appellantCaseValidationOutcome: {
		name: 'Valid'
	}
};

export const incompleteAppellantCaseOutcome = {
	appellantCaseIncompleteReasonsOnAppellantCases: [
		{
			appellantCaseIncompleteReason: {
				name: 'The original application form is incomplete or missing'
			}
		},
		{
			appellantCaseIncompleteReason: {
				name: 'Other'
			}
		}
	],
	appellantCaseValidationOutcome: {
		name: 'Incomplete'
	}
};

export const invalidAppellantCaseOutcome = {
	appellantCaseIvalidReasonsOnAppellantCases: [
		{
			appellantCaseInvalidReason: {
				name: 'Appeal has not been submitted on time'
			}
		},
		{
			appellantCaseInvalidReason: {
				name: 'Other'
			}
		}
	],
	appellantCaseValidationOutcome: {
		name: 'Invalid'
	}
};

export const completeLPAQuestionnaireOutcome = {
	lpaQuestionnaireValidationOutcome: {
		name: 'Complete'
	}
};

export const incompleteLPAQuestionnaireOutcome = {
	lpaQuestionnaireIncompleteReasonsOnLpaQuestionnaire: [
		{
			lpaQuestionnaireIncompleteReason: {
				name: 'Documents or information are missing'
			}
		},
		{
			lpaQuestionnaireIncompleteReason: {
				name: 'Other'
			}
		}
	],
	lpaQuestionnaireValidationOutcome: {
		name: 'Incomplete'
	}
};
