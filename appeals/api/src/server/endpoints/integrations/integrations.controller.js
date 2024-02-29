import {
	mapAppealSubmission,
	mapQuestionnaireSubmission,
	mapDocumentSubmission,
	mapAppeal,
	mapDocument,
	mapServiceUser
} from './integrations.mappers/index.js';

import {
	importAppellantCase,
	importLPAQuestionnaire,
	importDocument,
	produceAppealUpdate,
	produceServiceUsersUpdate,
	produceDocumentUpdate,
	produceBlobMoveRequest
} from './integrations.service.js';

import { addDocumentAudit } from '#endpoints/documents/documents.service.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';
import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import { EventType } from '@pins/event-client';
import BackOfficeAppError from '#utils/app-error.js';
import {
	AUDIT_TRAIL_APPELLANT_IMPORT_MSG,
	AUDIT_TRAIL_LPAQ_IMPORT_MSG,
	AUDIT_TRAIL_DOCUMENT_IMPORTED,
	AUDIT_TRAIL_SYSTEM_UUID
} from '#endpoints/constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('#config/../openapi-types.js').AppellantCaseData} AppellantCaseData */
/** @typedef {import('#config/../openapi-types.js').QuestionnaireData} QuestionnaireData */
/** @typedef {import('#config/../openapi-types.js').AddDocumentsRequest} AddDocumentsRequest */

/**
 * @param {{body: AppellantCaseData}} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postAppealSubmission = async (req, res) => {
	const { appeal, documents } = mapAppealSubmission(req.body);
	const dbSavedResult = await importAppellantCase(appeal, documents);

	await createAuditTrail({
		appealId: dbSavedResult.appeal.id,
		details: AUDIT_TRAIL_APPELLANT_IMPORT_MSG,
		azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID
	});

	const appealTopic = mapAppeal(dbSavedResult.appeal);
	await produceAppealUpdate(appealTopic, EventType.Create);

	if (dbSavedResult.appeal.appellantId) {
		const appellantTopic = mapServiceUser(
			dbSavedResult,
			// @ts-ignore
			dbSavedResult.appeal.appellant,
			'appellant'
		);
		if (appellantTopic) {
			await produceServiceUsersUpdate([appellantTopic], EventType.Create, 'appellant');
		}
	}

	if (dbSavedResult.appeal.agentId) {
		// @ts-ignore
		const agentTopic = mapServiceUser(dbSavedResult, dbSavedResult.appeal.agent, 'agent');
		if (agentTopic) {
			await produceServiceUsersUpdate([agentTopic], EventType.Create, 'agent');
		}
	}

	const documentsToMove = documents.map((d) => {
		return {
			originalURI: d.documentURI,
			importedURI: dbSavedResult.documentVersions.find((dv) => dv.documentGuid === d.documentGuid)
				.documentURI
		};
	});

	await produceBlobMoveRequest(documentsToMove, EventType.Create);

	const documentsTopic = dbSavedResult.documentVersions.map((d) => mapDocument(d));
	for (const documentTopic of documentsTopic) {
		const auditTrail = await createAuditTrail({
			appealId: dbSavedResult.appeal.id,
			azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID,
			details: stringTokenReplacement(AUDIT_TRAIL_DOCUMENT_IMPORTED, [documentTopic.fileName])
		});
		if (auditTrail) {
			await addDocumentAudit(documentTopic.documentGuid, 1, auditTrail, 'Create');
		}
	}

	await produceDocumentUpdate(documentsTopic, EventType.Create);

	return res.send(appealTopic);
};

/**
 * @param {{body: QuestionnaireData}} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postLpaqSubmission = async (req, res) => {
	const { caseReference, questionnaire, nearbyCaseReferences, documents } =
		mapQuestionnaireSubmission(req.body);
	const dbSavedResult = await importLPAQuestionnaire(
		caseReference,
		nearbyCaseReferences,
		questionnaire,
		documents
	);
	if (!dbSavedResult?.appeal) {
		throw new BackOfficeAppError(
			`Failure importing LPA questionnaire. Appeal with case reference '${caseReference}' does not exist.`
		);
	}

	await createAuditTrail({
		appealId: dbSavedResult.appeal.id,
		details: AUDIT_TRAIL_LPAQ_IMPORT_MSG,
		azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID
	});

	const appealTopic = mapAppeal(dbSavedResult.appeal);
	await produceAppealUpdate(appealTopic, EventType.Update);

	const documentsToMove = documents.map((d) => {
		return {
			originalURI: d.documentURI,
			importedURI: dbSavedResult.documentVersions.find((dv) => dv.documentGuid === d.documentGuid)
				.documentURI
		};
	});

	await produceBlobMoveRequest(documentsToMove, EventType.Create);

	const documentsTopic = dbSavedResult.documentVersions.map((d) => mapDocument(d));
	for (const documentTopic of documentsTopic) {
		const auditTrail = await createAuditTrail({
			appealId: dbSavedResult.appeal.id,
			azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID,
			details: stringTokenReplacement(AUDIT_TRAIL_DOCUMENT_IMPORTED, [documentTopic.fileName])
		});
		if (auditTrail) {
			await addDocumentAudit(documentTopic.documentGuid, 1, auditTrail, 'Create');
		}
	}

	await produceDocumentUpdate(documentsTopic, EventType.Create);

	return res.send(appealTopic);
};

/**
 * @param {{body: AddDocumentsRequest}} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postDocumentSubmission = async (req, res) => {
	const data = mapDocumentSubmission(req.body);
	const result = await importDocument(data);
	const formattedResult = mapDocument(result);

	return res.send(formattedResult);
};
