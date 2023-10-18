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
	produceDocumentUpdate
} from './integrations.service.js';

import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import { EventType } from '@pins/event-client';
import BackOfficeAppError from '#utils/app-error.js';
import {
	AUDIT_TRAIL_SYSTEM_UUID,
	AUDIT_TRAIL_APPELLANT_IMPORT_MSG,
	AUDIT_TRAIL_LPAQ_IMPORT_MSG
} from '#endpoints/constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('#config/../openapi-types.js').AppellantCaseData} AppellantCaseData */
/** @typedef {import('#config/../openapi-types.js').QuestionnaireData} QuestionnaireData */
/** @typedef {import('#config/../openapi-types.js').DocumentMetaImport} DocumentMetaImport */

/**
 * @param {{body: AppellantCaseData}} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postAppealSubmission = async (req, res) => {
	const { appeal, documents } = mapAppealSubmission(req.body);
	const dbSavedResult = await importAppellantCase(appeal, documents);

	await createAuditTrail({
		appealId: dbSavedResult.id,
		details: AUDIT_TRAIL_APPELLANT_IMPORT_MSG,
		azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID
	});

	const appealTopic = mapAppeal(dbSavedResult);
	await produceAppealUpdate(appealTopic, EventType.Create);

	if (dbSavedResult.appellantId) {
		// @ts-ignore
		const appellantTopic = mapServiceUser(dbSavedResult, dbSavedResult.appellant, 'appellant');
		await produceServiceUsersUpdate([appellantTopic], EventType.Create, 'appellant');
	}
	if (dbSavedResult.agentId) {
		// @ts-ignore
		const agentTopic = mapServiceUser(dbSavedResult, dbSavedResult.agent, 'agent');
		await produceServiceUsersUpdate([agentTopic], EventType.Create, 'agent');
	}

	const documentsTopic = documents.map((d) => mapDocument(d));
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
	if (!dbSavedResult) {
		throw new BackOfficeAppError(
			`Failure importing LPA questionnaire. Appeal with case reference '${caseReference}' does not exist.`
		);
	}

	await createAuditTrail({
		appealId: dbSavedResult.id,
		details: AUDIT_TRAIL_LPAQ_IMPORT_MSG,
		azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID
	});

	const appealTopic = mapAppeal(dbSavedResult);
	await produceAppealUpdate(appealTopic, EventType.Update);

	const documentsTopic = documents.map((d) => mapDocument(d));
	await produceDocumentUpdate(documentsTopic, EventType.Create);

	return res.send(appealTopic);
};

/**
 * @param {{body: DocumentMetaImport}} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postDocumentSubmission = async (req, res) => {
	const data = mapDocumentSubmission(req.body);
	const result = await importDocument(data);
	const formattedResult = mapDocument(result);

	return res.send(formattedResult);
};
