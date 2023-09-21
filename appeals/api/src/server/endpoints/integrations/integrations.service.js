import { producers } from '#infrastructure/topics.js';
import { eventClient } from '#infrastructure/event-client.js';

export const produceAppealUpdate = async (
	/** @type {any} */ appeal, // TODO: data and document types schema (PINS data model)
	/** @type {string} */ updateType
) => {
	const topic = producers.boCaseData;
	const res = await eventClient.sendEvents(topic, [appeal], updateType);
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
	const res = await eventClient.sendEvents(topic, [document], updateType);
	if (res) {
		return true;
	}

	return false;
};
