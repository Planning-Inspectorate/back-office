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
	incompleteAppealMssingOrWrongReasons: {
		1: 'Names do not match',
		2: 'Sensitive information included',
		3: 'Missing or wrong documents',
		4: 'Inflammatory comments made',
		5: 'Opened in error',
		6: 'Wrong appeal type used',
		7: 'Other'
	},
	incompleteAppealMssingOrWrongDocuments: {
		1: 'Application form',
		2: 'Decision notice',
		3: 'Grounds of appeal',
		4: 'Supporting documents'
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
