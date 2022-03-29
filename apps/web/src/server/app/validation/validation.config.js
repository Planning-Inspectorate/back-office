// Validation form fields labels
// These are mostly used on the check and confrim and summary pages.
export const validationLabelsMap = {
	invalidAppealReasons: {
		outOfTime: 'Out of time',
		noRightOfappeal: 'No right of appeal',
		notAppealable: 'Not appealable',
		lPADeemedInvalid: 'LPA deemed application as invalid',
		otherReason: 'Other'
	},
	incompleteAppealReasons: {
		namesDoNotMatch: 'Names do not match',
		sensitiveinfo: 'Sensitive information included',
		missingOrWrongDocs: 'Missing or wrong documents',
		inflamatoryComments: 'Inflammatory comments made',
		openedInError: 'Opened in error',
		wrongAppealType: 'Wrong appeal type used',
		otherReason: 'Other'
	},
	incompleteAppealMissingOrWrongDocumentsReasons: {
		applicationForm: 'Application form',
		decisionNotice: 'Decision notice',
		groundsOfAppeal: 'Grounds of appeal',
		supportingDocuments: 'Supporting documents'
	}
};

export const validationAppealOutcomeLabelsMap = {
	'valid': {
		label: 'Valid',
		reasonLabel: 'Description of development',
		continueButtonLabel: 'Confirm and start appeal',
		reviewCompleteStatusLabel: 'Appeal valid',
		reviewCompleteLabel: 'The appeal has been started and the LPA questionnaire email has been sent.'
	},
	'invalid': {
		label: 'Invalid',
		reasonLabel: 'Reasons',
		continueButtonLabel: 'Confirm and turn away appeal',
		reviewCompleteStatusLabel: 'Appeal invalid',
		reviewCompleteLabel: 'The appeal has been turned away, and emails have been sent to the appellant and LPA.'
	},
	'incomplete': {
		label: 'Something is missing or wrong',
		reasonLabel: 'Reasons',
		continueButtonLabel: 'Confirm and finish review',
		reviewCompleteStatusLabel: 'Something is missing or wrong',
		reviewCompleteLabel: ''
	}
};
