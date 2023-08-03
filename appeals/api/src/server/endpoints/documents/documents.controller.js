import * as service from './documents.service.js';

/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('express').Response} Response */

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const getFolder = async (req, res) => {
	const { appeal } = req;
	const { folderId } = req.params;
	const folder = await service.getFolderForAppeal(appeal, folderId);

	return res.send(folder);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const getDocument = async (req, res) => {
	const { document } = req;

	return res.send(document);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const addDocuments = async (req, res) => {
	const { appeal } = req;
	const documentInfo = await service.addDocumentsToAppeal(req.body, appeal);

	return res.send(getStorageInfo(documentInfo.documents));
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const addDocumentVersion = async (req, res) => {
	const { appeal, body, document } = req;
	const documentInfo = await service.addVersionToDocument(body, appeal, document);

	return res.send(getStorageInfo(documentInfo.documents));
};

/**
 * @type {(docs: (BlobInfo|null)[]) => object}
 */
const getStorageInfo = (docs) => {
	return {
		documents: docs.map((d) => {
			if (d) {
				return {
					documentName: d.documentName,
					GUID: d.GUID,
					blobStoreUrl: d.blobStoreUrl
				};
			}
		})
	};
};

export { getFolder, getDocument, addDocuments, addDocumentVersion };
