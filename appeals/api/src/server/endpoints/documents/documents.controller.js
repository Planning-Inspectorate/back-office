import {
	getDocumentsForAppeal,
	getDocumentForAppeal,
	addDocumentsToAppeal,
	addVersionToDocument
} from './documents.service.js';

/** @typedef {import('@pins/appeals/index.js').DocumentApiRequest} DocumentApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentVersionApiRequest} DocumentVersionApiRequest */
/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const getDocumentLocations = async (req, res) => {
	const { appeal } = req;
	const allFoldersAndDocuments = await getDocumentsForAppeal(appeal);
	const locations = allFoldersAndDocuments.map((p) => {
		return {
			displayName: p.displayName,
			path: p.path
		};
	});

	return res.send(locations);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const getDocuments = async (req, res) => {
	const { appeal } = req;
	const allFoldersAndDocuments = await getDocumentsForAppeal(appeal);

	return res.send(allFoldersAndDocuments);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const getDocument = async (req, res) => {
	const { documentId } = req.params;
	const doc = await getDocumentForAppeal(documentId);

	return res.send(doc);
};

/**
 *
 * @type {RequestHandler}
 */
const addDocuments = async (req, res) => {
	const { appeal } = req;
	const documentInfo = await addDocumentsToAppeal(req.body, appeal);

	const storageInfo = {
		documents: documentInfo.documents.map((d) => {
			return {
				documentName: d.documentName,
				GUID: d.GUID,
				blobStoreUrl: d.blobStoreUrl
			};
		})
	};

	res.send(storageInfo);
};

/**
 *
 * @type {RequestHandler}
 */
const addDocumentVersion = async (req, res) => {
	const { appeal, body } = req;
	const { documentId } = req.params;
	const documentInfo = await addVersionToDocument(body, appeal, documentId);

	const storageInfo = {
		documents: documentInfo.documents.map((d) => {
			return {
				documentName: d.documentName,
				GUID: d.GUID,
				blobStoreUrl: d.blobStoreUrl
			};
		})
	};

	res.send(storageInfo);
};

export { getDocumentLocations, getDocument, getDocuments, addDocuments, addDocumentVersion };
