import { DefaultAzureCredential } from '@azure/identity';
import { ServiceBusClient } from '@azure/service-bus';

/** @typedef {{body: any, contentType: string, applicationProperties: {version: string, type: string, traceId: number}}} MessageObjectToSend */

export class ServiceBusEventClient {
	/**
	 *
	 * @param {import('./event-client').Logger} logger
	 * @param {string} serviceBusHostname
	 */
	constructor(logger, serviceBusHostname) {
		this.logger = logger;
		this.client = new ServiceBusClient(serviceBusHostname, new DefaultAzureCredential());
	}

	/**
	 *
	 * @param {string} topic
	 * @returns {import('@azure/service-bus').ServiceBusSender}
	 */
	#createSender = (topic) => {
		return this.client.createSender(topic);
	};

	/**
	 * TODO: needs to be actually implemented
	 *
	 * @returns {number}
	 */
	#createTraceId = () => {
		return Date.now();
	};

	/**
	 *
	 * @param {object[]} events
	 * @param {number} traceId
	 * @param {import('./event-type.js').EventType} type
	 * @returns {MessageObjectToSend[]}
	 */
	#transformMessagesToSend = (events, traceId, type) => {
		return events.map((body) => ({
			body,
			contentType: 'application/json',
			applicationProperties: {
				version: '0.1',
				traceId,
				type
			}
		}));
	};

	/**
	 *
	 * @param {string} topic
	 * @param {any[]} events
	 * @param {import('./event-type.js').EventType} eventType
	 */
	sendEvents = async (topic, events, eventType) => {
		const sender = this.#createSender(topic);

		const traceId = this.#createTraceId();

		this.logger.info(
			`Publishing ${events.length} events to topic ${topic} with type ${eventType} and trace id ${traceId}`
		);

		await sender.sendMessages(this.#transformMessagesToSend(events, traceId, eventType));

		return events;
	};
}
