import { TableNames } from '../../tools/table-names.js';
import {
	TEST_CONSTANTS_GENERIC,
	TEST_CONSTANTS_PROJECT_ENTITY
} from '../../tools/test-constants.js';

export const projectTestDataCbos = {
	[TableNames.CASE]: {
		reference: TEST_CONSTANTS_GENERIC.caseReference,
		description: TEST_CONSTANTS_PROJECT_ENTITY.projectDescriptionEnglish,
		title: TEST_CONSTANTS_PROJECT_ENTITY.projectNameEnglish,
		descriptionWelsh: TEST_CONSTANTS_PROJECT_ENTITY.projectDescriptionWelsh,
		titleWelsh: TEST_CONSTANTS_PROJECT_ENTITY.projectNameWelsh,
		migrationStatus: TEST_CONSTANTS_PROJECT_ENTITY.migrationStatus.FALSE
	},
	[TableNames.APPLICATION_DETAILS]: {
		locationDescription: TEST_CONSTANTS_PROJECT_ENTITY.projectLocation,
		caseEmail: TEST_CONSTANTS_GENERIC.emailAddress,
		dateOfDCOSubmission: new Date(TEST_CONSTANTS_GENERIC.dates.date1),
		dateOfDCOAcceptance: new Date(TEST_CONSTANTS_GENERIC.dates.date2),
		dateOfRepresentationPeriodOpen: new Date(TEST_CONSTANTS_GENERIC.dates.date3),
		dateOfRelevantRepresentationClose: new Date(TEST_CONSTANTS_GENERIC.dates.date4),
		datePINSFirstNotifiedOfProject: new Date(TEST_CONSTANTS_GENERIC.dates.date1),
		dateProjectAppearsOnWebsite: new Date(TEST_CONSTANTS_GENERIC.dates.date1)
	}
};
