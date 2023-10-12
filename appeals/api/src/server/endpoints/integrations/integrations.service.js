import pino from '#utils/logger.js';
import { producers } from '#infrastructure/topics.js';
import { eventClient } from '#infrastructure/event-client.js';
import { schemas, validateFromSchema } from './integrations.validators.js';
import {
	createAppeal,
	createOrUpdateLpaQuestionnaire,
	createDocument
} from '#repositories/integrations.repository.js';

export const importAppellantCase = async (/** @type {any} */ data, /** @type {any} */ documents) =>
	await createAppeal(data, documents);

export const importLPAQuestionnaire = async (
	/** @type {any} */ caseReference,
	/** @type {any} */ nearbyCaseReferences,
	/** @type {any} */ data,
	/** @type {any} */ documents
) => await createOrUpdateLpaQuestionnaire(caseReference, nearbyCaseReferences, data, documents);

export const importDocument = async (/** @type {any} */ document) => await createDocument(document);

export const produceAppealUpdate = async (
	/** @type {any} */ appeal, // TODO: data and document types schema (PINS data model)
	/** @type {string} */ updateType
) => {
	const validationResult = await validateFromSchema(schemas.appeal, appeal);
	if (validationResult === true) {
		const topic = producers.boCaseData;
		const res = await eventClient.sendEvents(topic, [appeal], updateType);
		if (res) {
			return true;
		}
	} else {
		pino.error('Error producing appeal update', validationResult.errors);
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
