import { getEventClient } from '@pins/event-client';
import config from '../config/config.js';
import logger from '../utils/logger.js';

export const eventClient = getEventClient(
	config.serviceBusEnabled,
	logger,
	config.serviceBusOptions.hostname
);
