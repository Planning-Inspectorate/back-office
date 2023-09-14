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
	blobStorageUrl: environment.AZURE_BLOB_STORE_HOST,
	virusScanningDisabled: environment.VIRUS_SCANNING_DISABLED || false,
	documentStorageApi: {
		host: environment.DOCUMENT_STORAGE_API_HOST
	},
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
	wordpressDatabase: {
		username: environment.NI_DB_MYSQL_USERNAME,
		password: environment.NI_DB_MYSQL_PASSWORD,
		database: environment.NI_DB_MYSQL_DATABASE,
		host: environment.NI_DB_MYSQL_HOST,
		port: environment.NI_DB_MYSQL_PORT,
		dialect: environment.NI_DB_MYSQL_DIALECT
	}
});

if (error) {
	throw error;
}

export default value;
