// Validation form fields labels
// These are mostly used on the check and confrim and summary pages.
export const validationLabelsMap = {
	invalidAppealReasons: {
		1: 'Out of time',
		2: 'No right of appeal',
		3: 'Not appealable',
		4: 'LPA deemed application as invalid',
		5: 'Other'
	},
	incompleteAppealReasons: {
		namesDoNotMatch: 'Names do not match',
		sensitiveInformationIncluded: 'Sensitive information included',
		missingOrWrongDocuments: 'Missing or wrong documents',
		inflammatoryCommentsMade: 'Inflammatory comments made',
		openedInError: 'Opened in error',
		wrongAppealTypeUsed: 'Wrong appeal type used',
		other: 'Other'
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
