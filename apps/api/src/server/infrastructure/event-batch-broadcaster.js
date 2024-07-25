import { eventClient } from './event-client.js';
import logger from '#utils/logger.js';

const EVENT_BATCH_SIZE = 100;

/**
 * Send arrays of event messages in batches, to avoid 1mb throughput limit
 *
 * @param {string} topic
 * @param {any[]} events
 * @param {import('@pins/event-client').EventType} eventType
 * @param {Object.<string,any>?} [additionalProperties={}]
 */
export const batchSendEvents = async (topic, events, eventType, additionalProperties = {}) => {
	const batchSize = EVENT_BATCH_SIZE;
	// Send messages in chunks to avoid 1mb throughput limit
	for (let i = 0; i < events.length; i += batchSize) {
		const batch = events.slice(i, i + batchSize);

		try {
			await eventClient.sendEvents(topic, batch, eventType, additionalProperties);
			logger.info(`Broadcasted ${topic} events from range ${i} - ${i + batchSize}`);
		} catch (error) {
			logger.error(
				{ error: error.message },
				`Failed to broadcast ${topic} events at range ${i} - ${i + batchSize}`
			);
			throw error;
		}
	}
};
