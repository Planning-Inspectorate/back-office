import { createAppeal, createDocument } from '#repositories/integrations.repository.js';
import { mapAppealFromTopic, mapDocumentFromTopic } from './integrations.mapper.js';

/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals/index.js').AddDocumentsResponse} AddDocumentsResponse */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<any>}
 */
export const postAppealSubmission = async (req, res) => {
	const data = mapAppealFromTopic(req.body);
	const result = await createAppeal(data);

	// @ts-ignore
	return res.send(result);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<any>}
 */
export const postDocumentSubmission = async (req, res) => {
	const data = mapDocumentFromTopic(req.body);
	const result = await createDocument(data);

	// @ts-ignore
	return res.send(result);
};
