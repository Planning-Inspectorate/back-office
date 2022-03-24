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
	},
	changeAppellantName: {
		path: 'change-appellant-name',
		view: 'validation/change-appellant-name'
	},
	changeLpaName: {
		path: 'change-lpa-name',
		view: 'validation/change-lpa-name'
	},
	changeApplicationReference: {
		path: 'change-application-reference',
		view: 'validation/change-application-reference'
	},
	changeAppealSite: {
		path: 'change-appeal-site',
		view: 'validation/change-appeal-site'
	}
};

// LPA routing paths and all associated template views
export const lpaRoutesConfig = {
	home: {
		path: 'lpa',
		view: 'lpa/dashboard'
	},
	reviewQuestionnaireRoute: {
		path: 'review-questionnaire',
		view: 'lpa/review-questionnaire'
	},
};
