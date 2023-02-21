export class LocalEventClient {
	/**
	 *
	 * @param {import("./event-client").Logger} logger
	 */
	constructor(logger) {
		this.logger = logger;
	}

	sendEvents = async (/** @type {string} */ topic, /** @type {any[]} */ events) => {
		this.logger.info(`Dummy publishing events ${JSON.stringify(events)} to topic ${topic}`);

		return events;
	};
}
