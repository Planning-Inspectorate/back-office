import { LevelWithSilent } from 'pino';

export interface EnvironmentConfig {
	// The web application hostname (e.g. back-office-dev.planninginspectorate.gov.uk)
	appHostname: string;
	apiUrl: string;
	authDisabled: boolean;
	authDisabledGroupIds: string[];
	// redirect path for MSAL auth, defaults to /auth/redirect
	authRedirectPath: string;
	blobStorageUrl: string;
	blobStorageDefaultContainer: string;
	blobEmulatorSasUrl: string;
	useBlobEmulator: boolean;
	bundleAnalyzer: boolean;
	buildDir: string;
	cwd: string;
	env: 'development' | 'test' | 'production' | 'local';
	isProduction: boolean;
	isDevelopment: boolean;
	isTest: boolean;
	isRelease?: boolean;
	logLevelFile: LevelWithSilent;
	logLevelStdOut: LevelWithSilent;
	msal: {
		authority: string;
		clientId: string;
		apiClientId: string;
		clientSecret: string;
		redirectUri: string;
		logoutUri: string;
	};
	serverProtocol: 'http' | 'https';
	serverPort: number;
	sessionSecret: string;
	sslCertificateFile: string;
	sslCertificateKeyFile: string;
	tmpDir: string;
	referenceData: {
		appeals: {
			caseOfficerGroupId: string;
			inspectorGroupId: string;
			validationOfficerGroupId: string;
		};
	};
	featureFlags: {
		[key: string]: boolean;
	};
}

const config: EnvironmentConfig;

export default config;
