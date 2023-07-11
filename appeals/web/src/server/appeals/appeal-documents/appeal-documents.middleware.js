import { getFolderLayout, getFileInfo } from './appeal.documents.service.js';

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object | void>}
 */
export const validateCaseFolderId = async (req, res, next) => {
	const { appealId, folderId } = req.params;
	const folders = await getFolderLayout(appealId);
	if (folders && !req.caseFolders) {
		req.caseFolders = folders;
	}

	if (
		!folders ||
		folders.map((/** @type {{ id: number; }} */ f) => f.id).indexOf(Number(folderId)) === -1
	) {
		return res.status(404).render('app/404');
	}

	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object | void>}
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
