import pino from '#utils/logger.js';
import { producers } from '#infrastructure/topics.js';
import { eventClient } from '#infrastructure/event-client.js';
import { EventType } from '@pins/event-client';
import { mapAppeal } from './integrations.mappers/index.js';
import { schemas, validateFromSchema } from './integrations.validators.js';
import { randomUUID } from 'node:crypto';
import {
	createAppeal,
	createOrUpdateLpaQuestionnaire,
	createDocument,
	loadAppeal
} from '#repositories/integrations.repository.js';
import { databaseConnector } from '#utils/database-connector.js';

export const importAppellantCase = async (
	/** @type {any} */ data,
	/** @type {any} */ documents
) => {
	const existingDocs = await databaseConnector.document.findMany({
		where: {
			guid: {
				in: documents.map((/** @type {{ documentGuid: string; }} */ d) => d.documentGuid)
			}
		}
	});

	if (existingDocs?.length > 0) {
		const docIDs = existingDocs.map((d) => d.guid);
		for (const document of documents) {
			if (docIDs.indexOf(document.documentGuid) >= 0) {
				document.documentGuid = randomUUID();
			}
		}
	}

	const result = await createAppeal(data, documents);
	return result;
};

export const importLPAQuestionnaire = async (
	/** @type {any} */ caseReference,
	/** @type {any} */ nearbyCaseReferences,
	/** @type {any} */ data,
	/** @type {any} */ documents
) => {
	const existingDocs = await databaseConnector.document.findMany({
		where: {
			guid: {
				in: documents.map((/** @type {{ documentGuid: string; }} */ d) => d.documentGuid)
			}
		}
	});

	if (existingDocs?.length > 0) {
		const docIDs = existingDocs.map((d) => d.guid);
		for (const document of documents) {
			if (docIDs.indexOf(document.documentGuid) === 0) {
				document.documentGuid = randomUUID();
			}
		}
	}
	const result = await createOrUpdateLpaQuestionnaire(
		caseReference,
		nearbyCaseReferences,
		data,
		documents
	);
	return result;
};

export const importDocument = async (/** @type {any} */ document) => await createDocument(document);

export const produceAppealUpdate = async (
	/** @type {any} */ appeal, // TODO: data and document types schema (PINS data model)
	/** @type {string} */ updateType
) => {
	const validationResult = await validateFromSchema(schemas.appeal, appeal);
	if (validationResult !== true && validationResult.errors) {
		const errorDetails = validationResult.errors?.map(
			(e) => `${e.instancePath || '/'}: ${e.message}`
		);

		pino.error(`Error validating appeal: ${errorDetails[0]}`);
		return false;
	}

	const topic = producers.boCaseData;
	const res = await eventClient.sendEvents(topic, [appeal], updateType);
	if (res) {
		return true;
	}
	return false;
};

export const broadcastAppealState = async (/** @type {Number} */ id) => {
	const appeal = await loadAppeal(id);
	if (appeal) {
		const appealTopic = mapAppeal(appeal);
		await produceAppealUpdate(appealTopic, EventType.Update);
	}
};

export const produceDocumentUpdate = async (
	/** @type {any[]} */ documents, // TODO: data and document types schema (PINS data model)
	/** @type {string} */ updateType
) => {
	if (documents.length > 0) {
		const topic = producers.boDocument;
		const res = await eventClient.sendEvents(topic, documents, updateType);
		if (res) {
			return true;
		}

		return false;
	}
};

export const produceBlobMoveRequest = async (
	/** @type {any[]} */ documents, // TODO: data and document types schema (PINS data model)
	/** @type {string} */ updateType
) => {
	if (documents.length > 0) {
		const topic = producers.boBlobMove;
		const res = await eventClient.sendEvents(topic, documents, updateType);
		if (res) {
			return true;
		}

		return false;
	}
};

export const produceServiceUsersUpdate = async (
	/** @type {any[]} */ users, // TODO: data and document types schema (PINS data model)
	/** @type {string} */ updateType,
	/** @type {string} */ roleName
) => {
	if (users.length > 0) {
		const topic = producers.boServiceUser;
		const res = await eventClient.sendEvents(topic, users, updateType, { entityType: roleName });
		if (res) {
			return true;
		}
	}

	return false;
};
