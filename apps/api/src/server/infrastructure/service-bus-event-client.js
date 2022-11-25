import { DefaultAzureCredential } from '@azure/identity';
import { ServiceBusClient } from '@azure/service-bus';
import config from '../config/config.js';
import logger from '../utils/logger.js';

export class ServiceBusEventClient {
	constructor() {
		this.client = new ServiceBusClient(
			config.serviceBusOptions.hostname,
			new DefaultAzureCredential()
		);
	}

	/**
	 *
	 * @param {string} topic
	 * @param {any[]} events
	 */
	sendEvents = async (topic, events) => {
		// 1. Create the sender
		const sender = this.client.createSender(topic);

		// TODO obvs
		const traceId = Date.now();

		logger.info(`Broadcasting messages to topic ${topic} with trace id ${traceId}`);

		// 2. Transform the messages to ServiceBusMessage
		await sender.sendMessages(
			events.map((body) => ({
				body: JSON.stringify(body),
				contentType: 'application/json',
				applicationProperties: {
					version: '0.1',
					purpose: 'create',
					traceId
				}
			}))
		);

		// 3. Return the raised events
		return events;
	};
}
