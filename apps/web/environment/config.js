import { loadEnvironment } from '@pins/platform';
import schema from './schema.js';
import { baseConfigFromEnvironment } from './base-config.js';

/**
 * @typedef {import('./config.js').EnvironmentConfig} EnvironmentConfig
 */

/**
 * Loaded config, it only needs loading once
 * @type {EnvironmentConfig|undefined}
 */
let loadedConfig;

/**
 * Load environment settings, and returns validated config.
 *
 * @returns {EnvironmentConfig}
 */
export function loadConfig() {
	if (loadedConfig) {
		return loadedConfig;
	}
	const environment = loadEnvironment(process.env.NODE_ENV);
	const baseConfig = baseConfigFromEnvironment(environment);
	// defaults where needed
	const {
		API_HOST,
		APP_HOSTNAME,
		APPLICATIONS_CASE_ADMIN_OFFICER_GROUP_ID,
		APPLICATIONS_CASETEAM_GROUP_ID,
		APPLICATIONINSIGHTS_CONNECTION_STRING,
		APPLICATIONS_INSPECTOR_GROUP_ID,
		AUTH_CLIENT_ID = '*',
		AUTH_CLIENT_SECRET = '*',
		AUTH_DISABLED_GROUP_IDS = '',
		AUTH_DISABLED,
		AUTH_REDIRECT_PATH = '/auth/redirect',
		AUTH_TENANT_ID = '*',
		AZURE_BLOB_STORE_HOST,
		FEATURE_FLAG_BOAS_1_TEST_FEATURE,
		HTTP_PORT = 8080,
		HTTPS_ENABLED,
		HTTPS_PORT,
		LOG_LEVEL_FILE,
		LOG_LEVEL_STDOUT,
		REDIS_CONNECTION_STRING,
		DISABLE_REDIS,
		SESSION_SECRET,
		SSL_CERT_FILE,
		SSL_KEY_FILE,
		RETRY_MAX_ATTEMPTS,
		RETRY_STATUS_CODES,
		OS_PLACES_API_KEY,
		DUMMY_ADDRESS_DATA,
		DUMMY_USER_DATA
	} = environment;

	const config = {
		...baseConfig,
		appHostname: APP_HOSTNAME,
		apiUrl: API_HOST,
		appInsightsConnectionString: APPLICATIONINSIGHTS_CONNECTION_STRING,
		authDisabled: AUTH_DISABLED,
		authDisabledGroupIds: AUTH_DISABLED_GROUP_IDS.split(','),
		authRedirectPath: AUTH_REDIRECT_PATH,
		azureKeyVaultEnabled: environment.KEY_VAULT_ENABLED && environment.KEY_VAULT_ENABLED === 'true',
		blobStorageUrl: AZURE_BLOB_STORE_HOST,
		logLevelFile: LOG_LEVEL_FILE,
		logLevelStdOut: LOG_LEVEL_STDOUT,
		msal: {
			clientId: AUTH_CLIENT_ID,
			clientSecret: AUTH_CLIENT_SECRET,
			authority: `https://login.microsoftonline.com/${AUTH_TENANT_ID}`,
			logoutUri: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout'
		},
		serverPort: HTTPS_ENABLED === 'true' ? HTTPS_PORT : HTTP_PORT,
		serverProtocol: HTTPS_ENABLED === 'true' ? 'https' : 'http',
		serviceName: 'web',
		session: {
			redis: REDIS_CONNECTION_STRING,
			secret: SESSION_SECRET
		},
		retry: {
			maxAttempts: RETRY_MAX_ATTEMPTS,
			statusCodes: RETRY_STATUS_CODES
		},
		disableRedis: DISABLE_REDIS === 'true',
		sslCertificateFile: SSL_CERT_FILE,
		sslCertificateKeyFile: SSL_KEY_FILE,
		referenceData: {
			applications: {
				caseAdminOfficerGroupId: APPLICATIONS_CASE_ADMIN_OFFICER_GROUP_ID,
				caseTeamGroupId: APPLICATIONS_CASETEAM_GROUP_ID,
				inspectorGroupId: APPLICATIONS_INSPECTOR_GROUP_ID
			}
		},
		// flag name convention: featureFlag[ jira number ][ferature shoret description]
		// set Feature Flag default val here [default: false] - will be overwritted by values cming from the .env file
		featureFlags: {
			featureFlagBoas1TestFeature: FEATURE_FLAG_BOAS_1_TEST_FEATURE === 'true'
		},
		// Indicates the json file "dummy_address_data.json" will be used when true.
		dummyAddressData: !OS_PLACES_API_KEY && DUMMY_ADDRESS_DATA,
		// Indicates the json file "dummy_user_data.json" will be used when true.
		dummyUserData: AUTH_DISABLED && DUMMY_USER_DATA
	};

	const { value: validatedConfig, error } = schema.validate(config);

	if (error) {
		throw new Error(`loadConfig validation error: ${error.message}`);
	}

	loadedConfig = validatedConfig;
	return validatedConfig;
}

export default loadConfig();
