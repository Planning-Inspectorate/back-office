import { LevelWithSilent } from 'pino';

export interface EnvironmentConfig {
	apiUrl: string;
	authDisabled: boolean;
	authDisabledGroupIds: string[];
	blobStorageUrl: string;
	blobStorageAccountName: string;
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
		applications: {
			caseAdminOfficerGroupId: string;
			caseOfficerGroupId: string;
			inspectorGroupId: string;
		};
	};
	featureFlags: {
		[key: string]: boolean;
	};
}

const config: EnvironmentConfig;

export default config;
