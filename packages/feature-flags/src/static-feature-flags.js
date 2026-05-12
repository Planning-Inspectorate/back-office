import { AZURE_AI_LANGUAGE_REDACTION } from './feature-flags.js';

export default {
	'boas-1-test-feature': true,
	'applic-55-welsh-translation': true,
	'applic-625-custom-folders': true,
	'applics-861-fo-submissions': true,
	'applics-1036-training-sector': false,
	'applics-1845-fees-forecasting': false,
	[AZURE_AI_LANGUAGE_REDACTION]: false,
	'idas-340-redaction-service': false
};

export const flagsByReference = {
	[AZURE_AI_LANGUAGE_REDACTION]: ['BC0110003'],
	'idas-340-redaction-service': ['BC0110005']
};
