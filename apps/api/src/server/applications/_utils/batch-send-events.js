import { eventClient } from '#infrastructure/event-client.js';

/**
 *
 * @param {string} topic
 * @param {any[]} events
 * @param {import('./event-type.js').EventType} eventType
 * @param {Object.<string,any>?} [additionalProperties={}]
 */
export const batchSendEvents = async (topic, events, eventType, additionalProperties = {}) => {
	const batchSize = 100;
	// Send messages in chunks to avoid 1mb throughput limit
	for (let i = 0; i < events.length; i += batchSize) {
		const batch = events.slice(i, i + batchSize);

		try {
			await eventClient.sendEvents(topic, batch, eventType, additionalProperties);
			console.info(`Broadcasted ${topic} events from range ${i} - ${i + batchSize}`);
		} catch (error) {
			console.error(`Failed to broadcast ${topic} events at range ${i} - ${i + batchSize}`, error);
			throw error;
		}
	}
};
