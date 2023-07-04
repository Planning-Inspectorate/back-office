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
	const { appealId } = req.params;
	const allFoldersAndDocuments = await getDocumentsForAppeal(Number(appealId));
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
	const { appealId } = req.params;
	const allFoldersAndDocuments = await getDocumentsForAppeal(Number(appealId));

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
 * @type {import('express').RequestHandler<any, any, DocumentApiRequest> } | any, any>}
 */
const addDocuments = async ({ params, body }, response) => {
	const { appealId } = params;
	const documentInfo = await addDocumentsToAppeal(body, Number(appealId));

	const storageInfo = {
		documents: documentInfo.documents.map((d) => {
			return {
				documentName: d.documentName,
				GUID: d.GUID,
				blobStoreUrl: d.blobStoreUrl
			};
		})
	};

	response.send(storageInfo);
};

/**
 *
 * @type {import('express').RequestHandler<any, any, DocumentVersionApiRequest | any, any>}
 */
const addDocumentVersion = async ({ params, body }, response) => {
	const { appealId, documentId } = params;
	const documentInfo = await addVersionToDocument(body, Number(appealId), documentId);

	const storageInfo = {
		documents: documentInfo.documents.map((d) => {
			return {
				documentName: d.documentName,
				GUID: d.GUID,
				blobStoreUrl: d.blobStoreUrl
			};
		})
	};

	response.send(storageInfo);
};

export { getDocumentLocations, getDocument, getDocuments, addDocuments, addDocumentVersion };
