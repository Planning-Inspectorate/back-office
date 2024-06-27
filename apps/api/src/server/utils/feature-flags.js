import { FeatureFlagClient } from '@pins/feature-flags';
import config from '../config/config.js';
import pino from './logger.js';

export const featureFlagClient = new FeatureFlagClient(
	pino,
	config.featureFlagConnectionString,
	process.env.STATIC_FEATURE_FLAGS_ENABLED === 'true'
);
