// Validation routing paths and all associated template views
export const validationRoutesConfig = {
	home: {
		path: 'validation',
		view: 'validation/dashboard'
	},
	reviewAppealRoute: {
		path: 'review-appeal',
		view: 'validation/review-appeal'
	},
	validAppealOutcome: {
		path: 'valid-appeal-outcome',
		view: 'validation/valid-appeal-outcome'
	},
	invalidAppealOutcome: {
		path: 'invalid-appeal-outcome',
		view: 'validation/invalid-appeal-outcome'
	},
	incompleteAppealOutcome: {
		path: 'incomplete-appeal-outcome',
		view: 'validation/incomplete-appeal-outcome'
	},
	checkAndConfirm: {
		path: 'check-and-confirm',
		view: 'validation/check-and-confirm'
	},
	reviewAppealComplete: {
		path: 'review-appeal-complete',
		view: 'validation/review-appeal-complete'
	}
};

// LPA routing paths and all associated template views
export const lpaRoutesConfig = {
	home: {
		path: 'lpa',
		view: 'lpa/dashboard'
	},
	reviewQuestionnaire: {
		path: 'review-questionnaire',
		view: 'lpa/review-questionnaire'
	},
	checkAndConfirm: {
		path: 'check-and-confirm',
		view: 'lpa/check-and-confirm'
	}
};
