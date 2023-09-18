import { DefaultAzureCredential } from '@azure/identity';
import { ServiceBusClient } from '@azure/service-bus';

// 100 events would allow each event to have a body size of 10kb which is more than enough
// I haven't seen an event in the test environment larger than 1kb
const eventChunkSize = 100;

/** @typedef {{body: any, contentType: string, applicationProperties: Object.<string,any>}} MessageObjectToSend */

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
	 * @param {Object.<string,any>?} additionalProperties
	 * @returns {MessageObjectToSend[]}
	 */
	#transformMessagesToSend = (events, traceId, type, additionalProperties) => {
		return events.map((body) => ({
			body,
			contentType: 'application/json',
			applicationProperties: {
				version: '0.1',
				traceId,
				type,
				...additionalProperties
			}
		}));
	};

	/**
	 *
	 * @param {string} topic
	 * @param {any[]} events
	 * @param {import('./event-type.js').EventType} eventType
	 * @param {Object.<string,any>?} [additionalProperties={}]
	 */
	sendEvents = async (topic, events, eventType, additionalProperties = {}) => {
		const sender = this.#createSender(topic);

		const traceId = this.#createTraceId();

		this.logger.info(
			`Publishing ${events.length} events to topic ${topic} with type ${eventType} and trace id ${traceId}`
		);

		// Send messages in chunks to avoid 1mb throughput limit
		for (let i = 0; i < events.length; i += eventChunkSize) {
			const eventsChunk = events.slice(i, i + eventChunkSize);

			await sender.sendMessages(
				this.#transformMessagesToSend(eventsChunk, traceId, eventType, additionalProperties)
			);
		}

		return events;
	};
}
