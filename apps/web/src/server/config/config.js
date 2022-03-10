import { loadEnvironment } from 'planning-inspectorate-libs';

// All env variables used by the app should be defined in this file.

// To define new env:
// 1. Add env variable to `.env.development` and you can override locally in .env.local file;
// 2. Provide validation rules for your env in envsSchema; // TODO: Enforce this.
// 3. Make it visible outside of this module in export section;
// 4. Access your env variable only via config file.
// Do not use process.env object outside of this file.

loadEnvironment(process.env.NODE_ENV);

const config = {
	NODE_ENV: process.env.NODE_ENV,
	APP_RELEASE: process.env.APP_RELEASE,

	HTTPS_ENABLED: process.env.HTTPS_ENABLED,
	HTTP_PORT: process.env.HTTP_PORT || 8080,
	HTTPS_PORT: process.env.HTTPS_PORT || 8443,
	SSL_CERT_FILE: process.env.SSL_CERT_FILE,
	SSL_KEY_FILE: process.env.SSL_KEY_FILE,

	isProd: process.env.NODE_ENV === 'production',
	isRelease: process.env.APP_RELEASE === 'true',

	USE_MOCK_API: process.env.USE_MOCK_API,
	API_HOST: process.env.API_HOST
};

// Map env vars and make it visible outside module
export {
	config
};
