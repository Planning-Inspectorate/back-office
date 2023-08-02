import { createAppeal, createDocument } from '#repositories/integrations.repository.js';
import { mapAppealFromTopic, mapDocumentFromTopic } from './integrations.mapper.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('express').Response} Response */

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
export const postAppealSubmission = async (req, res) => {
	const data = mapAppealFromTopic(req.body);
	const result = await createAppeal(data);

	return res.send(result);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
export const postDocumentSubmission = async (req, res) => {
	const data = mapDocumentFromTopic(req.body);
	const result = await createDocument(data);

	return res.send(result);
};
