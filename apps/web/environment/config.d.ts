import { LevelWithSilent } from 'pino';

export interface EnvironmentConfig {
	apiUrl: string;
	authDisabled: boolean;
	bundleAnalyzer: boolean;
	cwd: string;
	env: 'development' | 'test' | 'production';
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
	};
	serverProtocol: 'http' | 'https';
	serverPort: number;
	sslCertificateFile: string;
	sslCertificateKeyFile: string;
	tmpDir: string;
	referenceData: {
		groups: {
			inspectorGroupId: string;
			caseOfficerGroupId: string;
			validationOfficerGroupId: string;
		};
	};
}

const config: EnvironmentConfig;

export default config;
