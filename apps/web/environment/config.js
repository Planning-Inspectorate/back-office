import { loadEnvironment } from '@pins/platform';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	apiUrl: environment.API_HOST,
	authDisabled: environment.AUTH_DISABLED,
	authRedirectTo: environment.AUTH_REDIRECT_URI || '/auth/redirect',
	bundleAnalyzer: environment.BUNDLE_ANALYZER,
	env: environment.NODE_ENV,
	isRelease: environment.APP_RELEASE,
	logLevelFile: environment.LOG_LEVEL_FILE,
	logLevelStdOut: environment.LOG_LEVEL_STDOUT,
	msal: {
		clientId: environment.AUTH_CLIENT_ID,
		clientSecret: environment.AUTH_CLIENT_SECRET,
		cloudInstanceId: environment.AUTH_CLOUD_INSTANCE_ID,
		tenantId: environment.AUTH_TENANT_ID
	},
	serverPort: environment.HTTPS_ENABLED === 'true' ? environment.HTTPS_PORT : environment.HTTP_PORT,
	serverProtocol: environment.HTTPS_ENABLED === 'true' ? 'https' : 'http',
	sslCertificateFile: environment.SSL_CERT_FILE,
	sslCertificateKeyFile: environment.SSL_KEY_FILE,
	referencedata: {
		groups: {
			inspectorGroupId: environment.AUTH_INSPECTOR_GROUP_ID,
			caseOfficerGroupId: environment.AUTH_CASEOFFICER_GROUP_ID,
			validationOfficerGroupId: environment.AUTH_VALIDATIONOFFICER_GROUP_ID
		}
	}
});

if (error) {
	throw error;
}

const { msal, ...config } = value;
const { clientId = '', cloudInstanceId, tenantId, clientSecret = '' } = msal;

export default {
	...config,
	cwd: url.fileURLToPath(new URL('..', import.meta.url)),
	isProduction: value.env === 'production',
	isDevelopment: value.env === 'development',
	isTest: value.env === 'test',
	msal: {
		clientId,
		clientSecret,
		authority: `${cloudInstanceId}/${tenantId}`
	}
};
