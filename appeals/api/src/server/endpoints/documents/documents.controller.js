import { ERROR_FAILED_TO_SAVE_DATA } from '#endpoints/constants.js';
import logger from '#utils/logger.js';
import * as service from './documents.service.js';
import * as documentRepository from '#repositories/document.repository.js';

/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const getFolder = async (req, res) => {
	const { appeal } = req;
	const { folderId } = req.params;
	const folder = await service.getFolderForAppeal(appeal, folderId);

	return res.send(folder);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const getDocument = async (req, res) => {
	const { document } = req;

	return res.send(document);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const addDocuments = async (req, res) => {
	const { appeal } = req;
	const documentInfo = await service.addDocumentsToAppeal(req.body, appeal);

	return res.send(getStorageInfo(documentInfo.documents));
};

/**
 * @param {Request} req
 * @param {Response} res
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

/**
 * @param {Request} req
 * @param {Response} res
 */
const updateDocuments = async (req, res) => {
	const { body } = req;

	try {
		await documentRepository.updateDocuments(body.documents);
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	res.send(body);
};

export { addDocuments, addDocumentVersion, getDocument, getFolder, updateDocuments };
