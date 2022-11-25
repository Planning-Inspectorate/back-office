import logger from '../utils/logger.js';

export class LocalEventClient {
	sendEvents = async (/** @type {string} */ topic, /** @type {any[]} */ events) => {
		logger.info(`Sending events ${JSON.stringify(events)} to topic ${topic}`);

		return events;
	};
}
