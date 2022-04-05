import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';

const validationActionsStrings = {
	invalid: 'INVALID',
	valid: 'VALID',
	information_missing: 'INFO_MISSING'
};

const validationStates = {
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
		always: [{ target: 'awaiting_lpa_questionnaire' }]
	},
	invalid_appeal: {
		entry: ['notifyAppellantOfInvalidAppeal', 'notifyLPAOfInvalidAppeal'],
		type: 'final'
	},
};

const validationActions = {
	notifyAppellantOfMissingAppealInfo: (_context, _event) => {
		console.log('Letting Appellant know that info is missing...');
	},
	notifyAppellantOfInvalidAppeal: (_context, _event) => {
		console.log('Letting Appellant know that their appeal is invalid...');
	},
	notifyLPAOfInvalidAppeal: (_context, _event) => {
		console.log('Letting LPA know that the appeal is invalid...');
	}
};

const validationStatesStrings = mapObjectKeysToStrings(validationStates);

export { validationStatesStrings, validationActionsStrings, validationStates, validationActions };
