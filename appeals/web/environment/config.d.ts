import { LevelWithSilent } from 'pino';

/**
 * Configuration required for bundling or build steps, not running the application.
 * Loaded from the process environment, and .env files.
 */
export interface BaseEnvironmentConfig {
	buildDir: string;
	bundleAnalyzer: boolean;
	cwd: string;
	env: 'development' | 'test' | 'production' | 'local';
	isProduction: boolean;
	isDevelopment: boolean;
	isTest: boolean;
	isRelease?: boolean;
}

/**
 * Configuration required for running the application.
 * Loaded from the process environment, and .env files.
 */
export interface EnvironmentConfig extends BaseEnvironmentConfig {
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
	cwd: string;
	logLevelFile: LevelWithSilent;
	logLevelStdOut: LevelWithSilent;
	msal: {
		authority: string;
		clientId: string;
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

export function loadConfig(): EnvironmentConfig;

const config: EnvironmentConfig;
export default config;
