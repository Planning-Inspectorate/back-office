import {
	mapAppealSubmission,
	mapQuestionnaireSubmission,
	mapDocumentSubmission,
	mapAppeal,
	mapDocument
} from './integrations.mappers/index.js';

import {
	importAppellantCase,
	importLPAQuestionnaire,
	importDocument,
	produceAppealUpdate
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
	const result = await importAppellantCase(appeal, documents);

	await createAuditTrail({
		appealId: result.id,
		details: AUDIT_TRAIL_APPELLANT_IMPORT_MSG,
		azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID
	});

	const formattedResult = mapAppeal(result);
	await produceAppealUpdate(formattedResult, EventType.Create);

	return res.send(formattedResult);
};

/**
 * @param {{body: QuestionnaireData}} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postLpaqSubmission = async (req, res) => {
	const { caseReference, questionnaire, documents } = mapQuestionnaireSubmission(req.body);
	const result = await importLPAQuestionnaire(caseReference, questionnaire, documents);
	if (!result) {
		throw new BackOfficeAppError(
			`Failure importing LPA questionnaire. Appeal with case reference '${caseReference}' does not exist.`
		);
	}

	await createAuditTrail({
		appealId: result.id,
		details: AUDIT_TRAIL_LPAQ_IMPORT_MSG,
		azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID
	});

	const formattedResult = mapAppeal(result);
	await produceAppealUpdate(formattedResult, EventType.Update);

	return res.send(formattedResult);
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
