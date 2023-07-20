import { getFolder, getFileInfo } from './appeal.documents.service.js';

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<void>}
 */
export const validateCaseFolderId = async (req, res, next) => {
	const { appealId, folderId } = req.params;
	const folder = await getFolder(appealId, folderId);

	if (!folder) {
		return res.status(404).render('app/404');
	}

	req.currentFolder = folder;
	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<void>}
 */
export const validateCaseDocumentId = async (req, res, next) => {
	const { appealId, documentId } = req.params;
	if (documentId) {
		const document = await getFileInfo(appealId, documentId);
		if (!document || !document.latestDocumentVersion) {
			return res.status(404).render('app/404');
		}
	}

	next();
};
