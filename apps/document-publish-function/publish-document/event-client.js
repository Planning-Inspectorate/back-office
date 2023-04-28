import { getEventClient } from '@pins/event-client';
import config from './config.js';

/**
 *
 * @param {import('@azure/functions').Context} context
 * @returns {{sendEvents: Function}}
 */
export const getEventClientWithContext = (context) => {
	return getEventClient(config.NODE_ENV !== 'test', context.log, config.SERVICE_BUS_HOSTNAME);
};
