import { loadEnvironment } from '@pins/platform';
import path from 'node:path';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value: validatedConfig, error } = schema.validate({
	apiUrl: environment.API_HOST,
	authDisabled: environment.AUTH_DISABLED,
	blobStorageUrl: environment.AZURE_BLOB_STORE_HOST,
	env: environment.NODE_ENV,
	isRelease: environment.APP_RELEASE,
	logLevelFile: environment.LOG_LEVEL_FILE,
	logLevelStdOut: environment.LOG_LEVEL_STDOUT,
	msal: {
		clientId: environment.AUTH_CLIENT_ID,
		clientSecret: environment.AUTH_CLIENT_SECRET,
		tenantId: environment.AUTH_TENANT_ID
	},
	serverPort: environment.HTTPS_ENABLED === 'true' ? environment.HTTPS_PORT : environment.HTTP_PORT,
	serverProtocol: environment.HTTPS_ENABLED === 'true' ? 'https' : 'http',
	sessionSecret: environment.SESSION_SECRET,
	sslCertificateFile: environment.SSL_CERT_FILE,
	sslCertificateKeyFile: environment.SSL_KEY_FILE,
	referenceData: {
		appeals: {
			caseOfficerGroupId: environment.APPEALS_CASE_OFFICER_GROUP_ID,
			inspectorGroupId: environment.APPEALS_INSPECTOR_GROUP_ID,
			validationOfficerGroupId: environment.APPEALS_VALIDATION_OFFICER_GROUP_ID
		},
		applications: {
			caseAdminOfficerGroupId: environment.APPLICATIONS_CASE_ADMIN_OFFICER_GROUP_ID,
			caseOfficerGroupId: environment.APPLICATIONS_CASEOFFICER_GROUP_ID,
			inspectorGroupId: environment.APPLICATIONS_INSPECTOR_GROUP_ID
		}
	},
	// flag name convention: featureFlag[ jira number ][ferature shoret description]
	// set Feature Flag default val here [default: true] - will be overwritted by values cming from the .env file
	featureFlags: {
		featureFlagBoasXTestFeature: environment.FEATURE_FLAG_BOAS_X_TEST_FEATURE === 'true'
	}
});

if (error) {
	throw error;
}

const cwd = url.fileURLToPath(new URL('..', import.meta.url));
const { AUTH_DISABLED_GROUP_IDS = '' } = environment;
const { msal, ...config } = validatedConfig;
const { clientId = '*', tenantId = '*', clientSecret = '*' } = msal;

export default {
	...config,
	authDisabledGroupIds: AUTH_DISABLED_GROUP_IDS.split(','),
	buildDir: path.join(cwd, '.build'),
	cwd,
	isProduction: validatedConfig.env === 'production',
	isDevelopment: validatedConfig.env === 'development' || validatedConfig.env === 'local',
	isTest: validatedConfig.env === 'test',
	msal: {
		clientId,
		clientSecret,
		authority: `https://login.microsoftonline.com/${tenantId}`,
		logoutUri: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout'
	},
	tmpDir: path.join(cwd, '.tmp')
};
