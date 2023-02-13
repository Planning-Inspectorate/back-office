import { loadEnvironment } from '@pins/platform';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	PORT: environment.PORT,
	SWAGGER_JSON_DIR: environment.SWAGGER_JSON_DIR || './src/server/swagger-output.json',
	DATABASE_URL: environment.DATABASE_URL,
	defaultApiVersion: environment.DEFAULT_API_VERSION || '1',
	documentStorageApi: {
		host: environment.DOCUMENT_STORAGE_API_HOST
	},
	serviceBusOptions: {
		host: environment.SERVICE_BUS_HOST,
		hostname: environment.SERVICE_BUS_HOSTNAME,
		reconnect_limit: Number(environment.SERVICE_BUS_RECONNECT_LIMIT),
		password: environment.SERVICE_BUS_PASSWORD,
		port: environment.SERVICE_BUS_PORT,
		reconnect: false,
		transport: environment.SERVICE_BUS_TRANSPORT,
		username: environment.SERVICE_BUS_USERNAME,
		subscriber: environment.SERVICE_BUS_SUBSCRIBER
	},
	msal: {
		clientId: environment.AUTH_API_CLIENT_ID,
		tenantId: environment.AUTH_TENANT_ID
	},
	queues: {
		startedCaseQueue: environment.SERVICE_BUS_STARTED_CASE_QUEUE
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
	clientCredentialsGrantEnabled:
		environment.CLIENT_CREDENTIAL_GRANT_ENABLED &&
		environment.CLIENT_CREDENTIAL_GRANT_ENABLED === 'true'
});

if (error) {
	throw error;
}

export default value;
