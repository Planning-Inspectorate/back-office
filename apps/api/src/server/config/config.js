import { loadEnvironment } from '@pins/platform';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	PORT: environment.PORT,
	gitSha:  process.env.GIT_SHA ?? 'NO GIT SHA FOUND',
	APPLICATIONINSIGHTS_CONNECTION_STRING: environment.APPLICATIONINSIGHTS_CONNECTION_STRING,
	SWAGGER_JSON_DIR: environment.SWAGGER_JSON_DIR || './src/server/swagger-output.json',
	DATABASE_URL: environment.DATABASE_URL,
	DATABASE_NAME: environment.DATABASE_NAME || 'Back Office Database',
	defaultApiVersion: environment.DEFAULT_API_VERSION || '1',
	blobStorageUrl: environment.AZURE_BLOB_STORE_HOST,
	blobStorageContainer: environment.AZURE_BLOB_STORE_CONTAINER,
	virusScanningDisabled: environment.VIRUS_SCANNING_DISABLED || false,
	serviceBusOptions: {
		hostname: environment.SERVICE_BUS_HOSTNAME
	},
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	},
	cwd: url.fileURLToPath(new URL('..', import.meta.url)),
	authDisabled: environment.AUTH_DISABLED === 'true',
	serviceBusEnabled: environment.SERVICE_BUS_ENABLED && environment.SERVICE_BUS_ENABLED === 'true',
	azureKeyVaultEnabled: environment.KEY_VAULT_ENABLED && environment.KEY_VAULT_ENABLED === 'true',
	featureFlagConnectionString: environment.PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING,
	featureFlagsStatic: environment.STATIC_FEATURE_FLAGS_ENABLED === 'true'
});

if (error) {
	throw error;
}

export default value;
