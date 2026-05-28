import { ServiceBusClient } from '@azure/service-bus';
import config from './config.js';
import { DefaultAzureCredential } from '@azure/identity';

/**
 * Creates a short-lived Service Bus queue sender, sends one message, then closes.
 *
 * @param {string} queueName
 * @param {object} body
 * @returns {Promise<void>}
 */
export const sendToQueue = async (queueName, body) => {
	const client = new ServiceBusClient(config.SERVICE_BUS_HOST_NAME, new DefaultAzureCredential(), {
		retryOptions: { maxRetries: 3 }
	});

	const sender = client.createSender(queueName);

	try {
		await sender.sendMessages({ body });
	} finally {
		await sender.close();
		await client.close();
	}
};
