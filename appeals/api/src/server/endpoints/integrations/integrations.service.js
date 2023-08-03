import { producers } from '#infrastructure/topics.js';
import { eventClient } from '#infrastructure/event-client.js';
import { mapAppealForTopic, mapDocumentForTopic } from './integrations.mapper.js';

export const produceAppealUpdate = async (
	/** @type {any} */ appeal, // TODO: data and document types schema (PINS data model)
	/** @type {string} */ updateType
) => {
	const topic = producers.boCaseData;
	const data = mapAppealForTopic(appeal);
	const res = await eventClient.sendEvents(topic, [data], updateType);
	if (res) {
		return true;
	}

	return false;
};

export const produceDocumentUpdate = async (
	/** @type {any} */ document, // TODO: data and document types schema (PINS data model)
	/** @type {string} */ updateType
) => {
	const topic = producers.boDocument;
	const data = mapDocumentForTopic(document);
	const res = await eventClient.sendEvents(topic, [data], updateType);
	if (res) {
		return true;
	}

	return false;
};
