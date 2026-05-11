import { ServiceBusClient } from '@azure/service-bus';
import config from './config.js';

/**
 * Creates a short-lived Service Bus queue sender, sends one message, then closes.
 * Uses the same `ServiceBusConnection` connection string that the function.json trigger bindings use.
 *
 * @param {string} queueName
 * @param {object} body
 * @returns {Promise<void>}
 */
export const sendToQueue = async (queueName, body) => {
	const client = new ServiceBusClient(config.SERVICE_BUS_CONNECTION_STRING);
	const sender = client.createSender(queueName);
	try {
		await sender.sendMessages({ body });
	} finally {
		await sender.close();
		await client.close();
	}
};
