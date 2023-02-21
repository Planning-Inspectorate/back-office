import { LocalEventClient } from './local-event-client.js';
import { ServiceBusEventClient } from './service-bus-event-client.js';

/**
 * @typedef {Function} InfoFunction
 * @param {string} content
 */

/** @typedef {{info: InfoFunction}} Logger */

/**
 *
 * @param {boolean} serviceBusEnabled
 * @param {any} logger
 * @param {string} serviceBusHostname
 * @returns {ServiceBusEventClient | LocalEventClient}
 */
export const getEventClient = (serviceBusEnabled, logger, serviceBusHostname = '') => {
	return serviceBusEnabled
		? new ServiceBusEventClient(logger, serviceBusHostname)
		: new LocalEventClient(logger);
};
