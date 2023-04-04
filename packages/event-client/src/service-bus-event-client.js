import { DefaultAzureCredential } from '@azure/identity';
import { ServiceBusClient } from '@azure/service-bus';

/** @typedef {{body: any, contentType: string, applicationProperties: {version: string, purpose: string, traceId: number}}} MessageObjectToSend */

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
	 * @param {object} body
	 * @param {number} traceId
	 * @returns {MessageObjectToSend}
	 */
	#transformMessageToServiceBusMessage = (body, traceId) => {
		return {
			body,
			contentType: 'application/json',
			applicationProperties: {
				version: '0.1',
				purpose: 'create',
				traceId
			}
		};
	};

	/**
	 *
	 * @param {object[]} events
	 * @param {number} traceId
	 * @returns {MessageObjectToSend[]}
	 */
	#transformMessagesToSend = (events, traceId) => {
		return events.map((body) => this.#transformMessageToServiceBusMessage(body, traceId));
	};

	/**
	 *
	 * @param {string} topic
	 * @param {any[]} events
	 */
	sendEvents = async (topic, events) => {
		const sender = this.#createSender(topic);

		const traceId = this.#createTraceId();

		this.logger.info(
			`Publishing ${events.length} events to topic ${topic} with trace id ${traceId}`
		);

		await sender.sendMessages(this.#transformMessagesToSend(events, traceId));

		return events;
	};
}
