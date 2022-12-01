import logger from '../utils/logger.js';

export class LocalEventClient {
	sendEvents = async (/** @type {string} */ topic, /** @type {any[]} */ events) => {
		logger.info(`Dummy publishing events ${JSON.stringify(events)} to topic ${topic}`);

		return events;
	};
}
