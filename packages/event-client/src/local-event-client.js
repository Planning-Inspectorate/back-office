import { EventType } from './event-type.js';

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
		/** @type {EventType} */ type
	) => {
		this.logger.info(
			`Dummy publishing events ${JSON.stringify(events)} with type ${type} to topic ${topic}`
		);

		return events;
	};
}
