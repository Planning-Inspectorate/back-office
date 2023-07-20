import { getDocumentById } from '#repositories/document.repository.js';
import { ERROR_NOT_FOUND } from '#endpoints/constants.js';

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateDocumentAndAddToRequest = async (req, res, next) => {
	const { documentId } = req.params;
	const document = await getDocumentById(documentId);

	if (!document) {
		return res.status(404).send({ errors: { documentId: ERROR_NOT_FOUND } });
	}

	req.document = document;
	next();
};
