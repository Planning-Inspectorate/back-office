import { GenericEventClient } from './generic-event-client.js';
import chalk from 'chalk';

/**
 * @property {import('ajv/dist/types/index.js').AnyValidateFunction<unknown>} validator
 */

// @ts-ignore
export class LocalEventClient extends GenericEventClient {
	/**
	 *
	 * @param {import('./event-client').Logger} logger
	 */
	constructor(logger) {
		super(logger);
		this.logger = {
			info: (/** @type {any} */ ...args) => console.log(chalk.yellow(...args))
		};
	}

	/**
	 * validate and send dummy publishing events
	 *
	 * @param {string} topic
	 * @param {any[]} events
	 * @param {import('./event-type.js').EventType} eventType
	 * @param {Object.<string,any>?} [additionalProperties={}]
	 */
	sendEvents = async (topic, events, eventType, additionalProperties = {}) => {
		const isValid = await this.validateEventsToSchema(
			topic,
			events,
			eventType,
			additionalProperties
		);

		if (isValid) {
			console.info(
				chalk.green(
					`Dummy publishing events ${JSON.stringify(
						events
					)} with type ${eventType}, additional properties ${JSON.stringify(
						additionalProperties
					)} to topic ${topic}`
				)
			);
		}

		return events;
	};
}
