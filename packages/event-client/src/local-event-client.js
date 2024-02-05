export class LocalEventClient {
	/**
	 *
	 * @param {import("./event-client").Logger} logger
	 */
	constructor(logger) {
		this.logger = logger;
	}

	sendEvents = async (
		/** @type {string} */ topic,
		/** @type {any[]} */ events,
		/** @type {import('./event-type.js').EventType}*/ type
	) => {
		if (events?.length < 1) {
			throw Error(`No events provided for type ${type} and topic ${topic}`);
		}
		this.logger.info(
			`Dummy publishing events ${JSON.stringify(events)} with type ${type} to topic ${topic}`
		);

		return events;
	};
}
