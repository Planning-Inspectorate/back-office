import { loadEnvironment } from '@pins/platform';

/** @typedef {'development' | 'test' | 'production'} EnvironmentType */

/**
 * @typedef {object} EnvironmentConfig
 * @property {EnvironmentType} NODE_ENV
 * @property {string} API_HOST
 * @property {boolean} APP_RELEASE
 * @property {boolean} HTTPS_ENABLED
 * @property {number} HTTP_PORT
 * @property {number} HTTPS_PORT
 * @property {string} SSL_CERT_FILE
 * @property {string} SSL_KEY_FILE
 * @property {boolean} bundleAnalyzer
 * @property {boolean} isProd
 * @property {boolean} isRelease
 * @property {boolean} isTest
 * @property {boolean} authDisabled
 * @property {string[]} authSimulatedGroups
 * @property {object} auth
 * @property {string} auth.redirectUri
 * @property {string} auth.inspectorGroupID
 * @property {string} auth.caseOfficerGroupID
 * @property {string} auth.validationOfficerGroupID
 * @property {object} auth.sso
 * @property {string} auth.sso.clientId
 * @property {string} auth.sso.clientSecret
 * @property {string} auth.sso.cloudInstanceId
 * @property {string} auth.sso.tenantId
 */

// All env variables used by the app should be defined in this file.

// To define new env:
// 1. Add env variable to `.env.development` and you can override locally in .env.local file;
// 2. Provide validation rules for your env in envsSchema; // TODO: Enforce this.
// 3. Make it visible outside of this module in export section;
// 4. Access your env variable only via config file.
// Do not use process.env object outside of this file.

const environment = loadEnvironment(process.env.NODE_ENV);

/** @type {EnvironmentConfig} */
export default {
	NODE_ENV: /** @type {EnvironmentType} */ (environment.NODE_ENV),
	APP_RELEASE: environment.APP_RELEASE === 'true',
	HTTPS_ENABLED: environment.HTTPS_ENABLED === 'true',
	HTTP_PORT: Number(environment.HTTP_PORT) || 8080,
	HTTPS_PORT: Number(environment.HTTPS_PORT) || 8443,
	SSL_CERT_FILE: environment.SSL_CERT_FILE,
	SSL_KEY_FILE: environment.SSL_KEY_FILE,

	bundleAnalyzer: environment.BUNDLE_ANALYZER === 'true',
	isProd: environment.NODE_ENV === 'production',
	isRelease: environment.APP_RELEASE === 'true',
	isTest: environment.NODE_ENV === 'test',
	authDisabled: environment.AUTH_DISABLED === 'true',
	authSimulatedGroups: (environment.AUTH_SIMULATED_GROUPS || '')
		.split(',')
		.map((group) => group.trim()),

	API_HOST: environment.API_HOST || '',

	auth: {
		sso: {
			clientId: environment.AUTH_CLIENT_ID || '',
			cloudInstanceId: environment.AUTH_CLOUD_INSTANCE_ID || '',
			tenantId: environment.AUTH_TENANT_ID || '',
			clientSecret: environment.AUTH_CLIENT_SECRET || ''
		},
		redirectUri: environment.AUTH_REDIRECT_URI || '/auth/redirect',
		inspectorGroupID: environment.AUTH_INSPECTOR_GROUP_ID || 'inspector',
		caseOfficerGroupID: environment.AUTH_CASEOFFICER_GROUP_ID || 'case_officer',
		validationOfficerGroupID: environment.AUTH_VALIDATIONOFFICER_GROUP_ID || 'validation_officer'
	}
};
