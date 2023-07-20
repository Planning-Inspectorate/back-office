import * as service from './documents.service.js';

/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals/index.js').AddDocumentsResponse} AddDocumentsResponse */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<Folder|null>}
 */
const getFolder = async (req, res) => {
	const { appeal } = req;
	const { folderId } = req.params;
	const folder = await service.getFolderForAppeal(appeal, folderId);

	// @ts-ignore
	return res.send(folder);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Document|null>}
 */
const getDocument = async (req, res) => {
	const { document } = req;

	// @ts-ignore
	return res.send(document);
};

/**
 *
 * @type {RequestHandler}
 * @returns {Promise<AddDocumentsResponse>}
 */
const addDocuments = async (req, res) => {
	const { appeal } = req;
	const documentInfo = await service.addDocumentsToAppeal(req.body, appeal);

	// @ts-ignore
	return res.send(getStorageInfo(documentInfo.documents));
};

/**
 *
 * @type {RequestHandler}
 * @returns {Promise<AddDocumentsResponse>}
 */
const addDocumentVersion = async (req, res) => {
	const { appeal, body, document } = req;
	const documentInfo = await service.addVersionToDocument(body, appeal, document);

	// @ts-ignore
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
