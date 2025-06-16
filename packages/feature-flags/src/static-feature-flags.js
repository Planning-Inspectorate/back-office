import { AZURE_AI_LANGUAGE_REDACTION } from './feature-flags.js';

export default {
	'boas-1-test-feature': true,
	'applic-55-welsh-translation': true,
	'applic-625-custom-folders': true,
	'applics-861-fo-submissions': true,
	'applics-1036-training-sector': false,
	[AZURE_AI_LANGUAGE_REDACTION]: false
};

export const flagsByReference = {
	[AZURE_AI_LANGUAGE_REDACTION]: ['BC0110003']
};
