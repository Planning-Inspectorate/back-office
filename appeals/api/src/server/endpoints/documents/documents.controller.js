import { getDocumentsForAppeal } from './documents.service.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const getDocuments = async (req, res) => {
	const { appealId } = req.params;
	const paths = await getDocumentsForAppeal(Number(appealId));

	return res.send(paths);
};

export { getDocuments };
