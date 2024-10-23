import {
	TEST_CONSTANTS_GENERIC,
	TEST_CONSTANTS_PROJECT_ENTITY
} from '../../tools/test-constants.js';

export const projectTestDataBackoffice = [
	{
		id: TEST_CONSTANTS_GENERIC.caseId,
		reference: TEST_CONSTANTS_GENERIC.caseReference,
		description: TEST_CONSTANTS_PROJECT_ENTITY.projectDescriptionEnglish,
		title: TEST_CONSTANTS_PROJECT_ENTITY.projectNameEnglish,
		descriptionWelsh: TEST_CONSTANTS_PROJECT_ENTITY.projectDescriptionWelsh,
		titleWelsh: TEST_CONSTANTS_PROJECT_ENTITY.projectNameWelsh,
		migrationStatus: TEST_CONSTANTS_PROJECT_ENTITY.migrationStatus.FALSE
	}
];
