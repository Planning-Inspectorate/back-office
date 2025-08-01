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
	gitSha?: string;
}

/**
 * Configuration required for running the application.
 * Loaded from the process environment, and .env files.
 */
export interface EnvironmentConfig extends BaseEnvironmentConfig {
	// The web application hostname (e.g. back-office-dev.planninginspectorate.gov.uk)
	appHostname: string;
	apiUrl: string;
	appInsightsConnectionString?: string;
	authDisabled: boolean;
	authDisabledGroupIds: string[];
	// redirect path for MSAL auth, defaults to /auth/redirect
	authRedirectPath: string;
	azureAiLanguage: {
		categories?: string; // CSV string of categories
		endpoint: string;
	};
	azureKeyVaultEnabled: boolean;
	blobStorageUrl: string;
	cacheControl: {
		maxAge: string;
	};
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
	retry: {
		maxAttempts: number;
		statusCodes: string;
	};
	serverProtocol: 'http' | 'https';
	serverPort: number;
	serviceName: string;
	session: {
		redis: string;
		secret: string;
	};
	disableRedis: boolean;
	sslCertificateFile: string;
	sslCertificateKeyFile: string;
	referenceData: {
		applications: {
			caseAdminOfficerGroupId: string;
			caseTeamGroupId: string;
			inspectorGroupId: string;
		};
	};
	dummyAddressData: boolean;
	dummyUserData: boolean;
	frontOfficeURL: string;
	featureFlagConnectionString: string;
	featureFlagsStatic: string;
	customFeaturesByCase: object;
}

export function loadConfig(): EnvironmentConfig;

const config: EnvironmentConfig;
export default config;
