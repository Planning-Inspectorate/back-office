import { createAppeal, createDocument } from '#repositories/integrations.repository.js';
import {
	mapAppealFromTopic,
	mapDocumentFromTopic,
	mapAppealForTopic,
	mapDocumentForTopic
} from './integrations.mapper.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('express').Response} Response */

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
export const postAppealSubmission = async (req, res) => {
	const { appeal, documents } = mapAppealFromTopic(req.body);
	const result = await createAppeal(appeal, documents);
	const formattedResult = mapAppealForTopic(result);

	return res.send(formattedResult);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
export const postDocumentSubmission = async (req, res) => {
	const data = mapDocumentFromTopic(req.body);
	const result = await createDocument(data);
	const formattedResult = mapDocumentForTopic(result);

	return res.send(formattedResult);
};
