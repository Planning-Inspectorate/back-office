import { loadEnvironment } from '@pins/platform';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	PORT: environment.PORT,
	SWAGGER_JSON_DIR: environment.SWAGGER_JSON_DIR || './src/server/openapi.json',
	DATABASE_URL: environment.DATABASE_URL,
	defaultApiVersion: environment.DEFAULT_API_VERSION || '1',
	serviceBusOptions: {
		hostname: environment.SERVICE_BUS_HOSTNAME
	},
	msal: {
		clientId: environment.AUTH_CLIENT_BACKEND_API_ID,
		tenantId: environment.AUTH_TENANT_ID
	},
	log: {
		levelFile: environment.LOG_LEVEL_FILE || 'silent',
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	},
	cwd: url.fileURLToPath(new URL('..', import.meta.url)),
	// flag name convention: featureFlag[ jira number ][ferature shoret description]
	// set Feature Flag default val here [default: false] - will be overwritted by values cming from the .env file
	featureFlags: {
		featureFlagBoas1TestFeature: !environment.FEATURE_FLAG_BOAS_1_TEST_FEATURE
			? false
			: environment.FEATURE_FLAG_BOAS_1_TEST_FEATURE === 'true'
	},
	serviceBusEnabled: environment.SERVICE_BUS_ENABLED && environment.SERVICE_BUS_ENABLED === 'true',
	timetable: {
		FPA: {
			lpaQuestionnaireDueDate: {
				daysFromStartDate: 5
			},
			statementReviewDate: {
				daysFromStartDate: 25
			},
			finalCommentReviewDate: {
				daysFromStartDate: 35
			}
		},
		HAS: {
			lpaQuestionnaireDueDate: {
				daysFromStartDate: 5
			}
		}
	},
	govNotify: {
		api: {
			key: environment.GOV_NOTIFY_API_KEY
		},
		template: {
			validAppellantCase: {
				id: '3b4b74b4-b604-411b-9c98-5be2c6f3bdfd'
			}
		},
		testMailbox: environment.TEST_MAILBOX || 'appellant@example.com'
	},
	bankHolidayFeed: {
		hostname: 'https://www.gov.uk/bank-holidays.json'
	},
	appealAllocationLevels: [
		{ level: 'A', band: 3 },
		{ level: 'B', band: 3 },
		{ level: 'C', band: 2 },
		{ level: 'D', band: 2 },
		{ level: 'E', band: 1 },
		{ level: 'F', band: 1 },
		{ level: 'G', band: 1 },
		{ level: 'H', band: 1 }
	],
	appealFolderLayout: [
		{ path: 'appellantCase/applicationForm', allowedTypes: [] },
		{ path: 'appellantCase/decisionLetter', allowedTypes: [] },
		{ path: 'appellantCase/designAndAccessStatement', allowedTypes: [] },
		{ path: 'appellantCase/planningObligation', allowedTypes: [] },
		{ path: 'appellantCase/plansDrawingsSupportingDocuments', allowedTypes: [] },
		{ path: 'appellantCase/separateOwnershipCertificate', allowedTypes: [] },
		{ path: 'appellantCase/newSupportingDocuments', allowedTypes: [] }
	]
});

if (error) {
	throw error;
}

export default value;
