import { loadEnvironment } from '@pins/platform';
import schema from './schema.js';

/**
 * @typedef {object} EnvironmentConfig
 * @property {string} apiUrl
 * @property {boolean} authDisabled
 * @property {string} authRedirectTo
 * @property {boolean} bundleAnalyzer
 * @property {'development' | 'test' | 'production'} env
 * @property {boolean} isProduction
 * @property {boolean} isDevelopment
 * @property {boolean} isTest
 * @property {object} msal
 * @property {string} msal.clientId
 * @property {string} msal.clientSecret
 * @property {string} msal.cloudInstanceId
 * @property {string} msal.tenantId
 * @property {boolean=} release
 * @property {string} serverProtocol
 * @property {number} serverPort
 * @property {string} sslCertificateFile
 * @property {string} sslCertificateKeyFile
 * @property {object} referencedata
 * @property {object} referencedata.groups
 * @property {string} referencedata.groups.inspectorGroupId
 * @property {string} referencedata.groups.caseOfficerGroupId
 * @property {string} referencedata.groups.validationOfficerGroupId
 */

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	apiUrl: environment.API_HOST,
	authDisabled: environment.AUTH_DISABLED,
	authRedirectTo: environment.AUTH_REDIRECT_URI || '/auth/redirect',
	bundleAnalyzer: environment.BUNDLE_ANALYZER,
	env: environment.NODE_ENV,
	msal: {
		clientId: environment.AUTH_CLIENT_ID,
		cloudInstanceId: environment.AUTH_CLOUD_INSTANCE_ID,
		clientSecret: environment.AUTH_CLIENT_SECRET,
		tenantId: environment.AUTH_TENANT_ID,
	},	
	release: environment.RELEASE,
	serverPort: environment.HTTPS_ENABLED === 'true' ? environment.HTTPS_PORT : environment.HTTP_PORT,
	serverProtocol: environment.HTTPS_ENABLED === 'true' ? 'https' : 'http',
	sslCertificateFile: environment.SSL_CERT_FILE,
	sslCertificateKeyFile: environment.SSL_KEY_FILE,
	referencedata: {
		groups: {
			inspectorGroupID: environment.AUTH_INSPECTOR_GROUP_ID,
			caseOfficerGroupID: environment.AUTH_CASEOFFICER_GROUP_ID,
			validationOfficerGroupID: environment.AUTH_VALIDATIONOFFICER_GROUP_ID
		}
	}
});

if (error) {
	throw error;
}

/** @type {EnvironmentConfig} */
export default {
	...value,
	isProduction: value.env === 'production',
	isDevelopment: value.env === 'development',
	isTest: value.env === 'test'
};
