import { loadEnvironment } from '@pins/platform';
import path from 'node:path';
import url from 'node:url';
import { baseSchema } from './schema.js';

const __dirname = url.fileURLToPath(import.meta.url);

/**
 * @typedef {import('./config.js').BaseEnvironmentConfig} BaseEnvironmentConfig
 */

/**
 * Returns validated base configuration from the given environment settings.
 *
 * @param {Record<string, string | undefined>} environment
 * @returns {BaseEnvironmentConfig}
 * @throws {Error}
 */
export function baseConfigFromEnvironment(environment) {
	const cwd = path.join(__dirname, '..'); // web folder

	const env = environment.NODE_ENV;
	const config = {
		bundleAnalyzer: false, // TODO: load this from environment?
		buildDir: path.join(cwd, '.build'),
		cwd,
		env,
		isProduction: env === 'production',
		isDevelopment: env === 'development' || env === 'local',
		isTest: env === 'test',
		isRelease: environment.APP_RELEASE
	};

	const { value: validatedConfig, error } = baseSchema.validate(config);

	if (error) {
		throw new Error(`loadBaseConfig validation error: ${error.message}`);
	}
	return validatedConfig;
}

/**
 * Loaded config, it only needs loading once
 * @type {BaseEnvironmentConfig|undefined}
 */
let baseConfig;

/**
 * Load environment settings, and returns validated base config.
 *
 * @returns {BaseEnvironmentConfig}
 */
export function loadBaseConfig() {
	if (baseConfig !== undefined) {
		return baseConfig;
	}
	const environment = loadEnvironment(process.env.NODE_ENV);
	const config = baseConfigFromEnvironment(environment);
	baseConfig = config;
	return config;
}
