import { LevelWithSilent } from 'pino';

export interface EnvironmentConfig {
	apiUrl: string;
	authDisabled: boolean;
	authDisabledGroupIds: string[];
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
}

const config: EnvironmentConfig;

export default config;
