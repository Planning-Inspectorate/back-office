import pino from 'pino';

const validationActionsStrings = {
	invalid: 'INVALID',
	valid: 'VALID',
	information_missing: 'INFO_MISSING'
};

const generateValidationStates = (finalState) => {
	return {
		received_appeal: {
			on: {
				INVALID: 'invalid_appeal',
				INFO_MISSING: 'awaiting_validation_info',
				VALID: 'valid_appeal'
			}
		},
		awaiting_validation_info: {
			entry: ['notifyAppellantOfMissingAppealInfo'],
			on: {
				INVALID: 'invalid_appeal',
				VALID: 'valid_appeal'
			}
		},
		valid_appeal: {
			always: [{ target: finalState }]
		},
		invalid_appeal: {
			entry: ['notifyAppellantOfInvalidAppeal', 'notifyLPAOfInvalidAppeal'],
			type: 'final'
		}
	};
};

const validationActions = {
	notifyAppellantOfMissingAppealInfo: () => {
		pino.log('Letting Appellant know that info is missing...');
	},
	notifyAppellantOfInvalidAppeal: () => {
		pino.log('Letting Appellant know that their appeal is invalid...');
	},
	notifyLPAOfInvalidAppeal: () => {
		pino.log('Letting LPA know that the appeal is invalid...');
	}
};

export { validationActionsStrings, generateValidationStates, validationActions };
