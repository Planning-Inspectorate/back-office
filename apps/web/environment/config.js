import { loadEnvironment } from '@pins/platform';
import path from 'node:path';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value: validatedConfig, error } = schema.validate({
	apiUrl: environment.API_HOST,
	authDisabled: environment.AUTH_DISABLED,
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
	isDevelopment: validatedConfig.env === 'development',
	isTest: validatedConfig.env === 'test',
	msal: {
		clientId,
		clientSecret,
		authority: `https://login.microsoftonline.com/${tenantId}`
	},
	tmpDir: path.join(cwd, '.tmp')
};
