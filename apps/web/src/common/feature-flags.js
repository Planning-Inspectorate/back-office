import { FeatureFlagClient } from '@pins/feature-flags';
import config from '@pins/applications.web/environment/config.js';
import pino from '@pins/applications.web/src/server/lib/logger.js';

export const featureFlagClient = new FeatureFlagClient(
	pino,
	config.featureFlagConnectionString,
	process.env.STATIC_FEATURE_FLAGS_ENABLED === 'true'
);
