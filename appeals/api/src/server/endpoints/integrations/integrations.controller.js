import {
	createAppeal,
	createOrUpdateLpaQuestionnaire,
	createDocument
} from '#repositories/integrations.repository.js';
import {
	mapAppealSubmission,
	mapQuestionnaireSubmission,
	mapDocumentSubmission,
	mapAppeal,
	mapDocument
} from './integrations.mapper.js';
import { produceAppealUpdate } from './integrations.service.js';
import { EventType } from '@pins/event-client';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postAppealSubmission = async (req, res) => {
	const { appeal, documents } = mapAppealSubmission(req.body);
	const result = await createAppeal(appeal, documents);
	const formattedResult = mapAppeal(result);

	await produceAppealUpdate(formattedResult, EventType.Create);
	return res.send(formattedResult);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postLpaqSubmission = async (req, res) => {
	const { caseReference, questionnaire, documents } = mapQuestionnaireSubmission(req.body);
	const result = await createOrUpdateLpaQuestionnaire(caseReference, questionnaire, documents);
	const formattedResult = mapAppeal(result);

	await produceAppealUpdate(formattedResult, EventType.Update);
	return res.send(formattedResult);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postDocumentSubmission = async (req, res) => {
	const data = mapDocumentSubmission(req.body);
	const result = await createDocument(data);
	const formattedResult = mapDocument(result);

	return res.send(formattedResult);
};
