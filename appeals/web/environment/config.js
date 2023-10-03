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
		APPEALS_CASE_OFFICER_GROUP_ID,
		APPEALS_INSPECTOR_GROUP_ID,
		APPEALS_LEGAL_TEAM_GROUP_ID,
		APPEALS_CS_TEAM_GROUP_ID,
		AUTH_CLIENT_ID = '*',
		AUTH_CLIENT_SECRET = '*',
		AUTH_DISABLED_GROUP_IDS = '',
		AUTH_DISABLED,
		AUTH_REDIRECT_PATH = '/auth/redirect',
		AUTH_TENANT_ID = '*',
		AZURE_BLOB_STORE_HOST,
		AZURE_BLOB_DEFAULT_CONTAINER,
		AZURE_BLOB_EMULATOR_SAS_HOST,
		AZURE_BLOB_USE_EMULATOR,
		FEATURE_FLAG_BOAS_1_TEST_FEATURE,
		HTTP_PORT = 8080,
		HTTPS_ENABLED,
		HTTPS_PORT,
		LOG_LEVEL_FILE,
		LOG_LEVEL_STDOUT,
		SESSION_SECRET,
		SSL_CERT_FILE,
		SSL_KEY_FILE
	} = environment;

	const config = {
		...baseConfig,
		appHostname: APP_HOSTNAME,
		apiUrl: API_HOST,
		authDisabled: AUTH_DISABLED,
		authDisabledGroupIds: AUTH_DISABLED_GROUP_IDS.split(','),
		authRedirectPath: AUTH_REDIRECT_PATH,
		blobStorageUrl: AZURE_BLOB_STORE_HOST,
		blobStorageDefaultContainer: AZURE_BLOB_DEFAULT_CONTAINER,
		blobEmulatorSasUrl: AZURE_BLOB_EMULATOR_SAS_HOST,
		useBlobEmulator: AZURE_BLOB_USE_EMULATOR,
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
		sessionSecret: SESSION_SECRET,
		sslCertificateFile: SSL_CERT_FILE,
		sslCertificateKeyFile: SSL_KEY_FILE,
		referenceData: {
			appeals: {
				caseOfficerGroupId: APPEALS_CASE_OFFICER_GROUP_ID,
				inspectorGroupId: APPEALS_INSPECTOR_GROUP_ID,
				legalGroupId: APPEALS_LEGAL_TEAM_GROUP_ID,
				customerServiceGroupId: APPEALS_CS_TEAM_GROUP_ID
			}
		},
		// flag name convention: featureFlag[ jira number ][ferature shoret description]
		// set Feature Flag default val here [default: false] - will be overwritted by values cming from the .env file
		featureFlags: {
			featureFlagBoas1TestFeature: FEATURE_FLAG_BOAS_1_TEST_FEATURE === 'true'
		}
	};

	const { value: validatedConfig, error } = schema.validate(config);

	if (error) {
		throw new Error(`loadConfig validation error: ${error.message}`);
	}

	loadedConfig = validatedConfig;
	return validatedConfig;
}

export default loadConfig();
