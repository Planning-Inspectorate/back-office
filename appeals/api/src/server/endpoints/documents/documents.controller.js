import {
	AUDIT_TRAIL_DOCUMENT_DELETED,
	AUDIT_TRAIL_DOCUMENT_UPLOADED,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_NOT_FOUND
} from '#endpoints/constants.js';
import logger from '#utils/logger.js';
import * as service from './documents.service.js';
import * as documentRepository from '#repositories/document.repository.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';
import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';

/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.AuditTrail} AuditTrail */
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
const getDocumentAndVersions = async (req, res) => {
	const { documentId } = req.params;
	const document = await documentRepository.getDocumentWithAllVersionsById(documentId);
	if (!document || document.isDeleted) {
		return res.status(404).send({ errors: { documentId: ERROR_NOT_FOUND } });
	}
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

	/**
	 * @type {any}[]}
	 */
	const auditTrails = [];

	await Promise.all(
		documentInfo.documents.map(
			async (document) =>
				document &&
				(await auditTrails.push({
					guid: document.GUID,
					version: 1,
					audit: await createAuditTrail({
						appealId: appeal.id,
						azureAdUserId: req.get('azureAdUserId'),
						details: stringTokenReplacement(AUDIT_TRAIL_DOCUMENT_UPLOADED, [
							document.documentName,
							1
						])
					})
				}))
		)
	);

	await Promise.all(
		auditTrails.map(
			(/** @type {{ guid: string; version: Number; audit: AuditTrail; }} */ auditTrail) =>
				auditTrail &&
				auditTrail.guid &&
				auditTrail.version &&
				auditTrail.audit &&
				service.addDocumentAudit(auditTrail.guid, Number(1), auditTrail.audit, 'Create')
		)
	);

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
	const updatedDocument = documentInfo.documents[0];

	if (updatedDocument) {
		const auditTrail = await createAuditTrail({
			appealId: appeal.id,
			azureAdUserId: req.get('azureAdUserId'),
			details: stringTokenReplacement(AUDIT_TRAIL_DOCUMENT_UPLOADED, [
				updatedDocument.documentName,
				updatedDocument.versionId
			])
		});
		if (auditTrail) {
			await service.addDocumentAudit(
				document.guid,
				updatedDocument.versionId,
				auditTrail,
				'Create'
			);
		}

		return res.send(getStorageInfo(documentInfo.documents));
	}

	return res.sendStatus(404);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const deleteDocumentVersion = async (req, res) => {
	const { document } = req;
	const { version } = req.params;

	const documentInfo = await service.deleteDocument(document, Number(version));

	if (documentInfo) {
		const auditTrail = await createAuditTrail({
			appealId: document.caseId,
			azureAdUserId: req.get('azureAdUserId'),
			details: stringTokenReplacement(AUDIT_TRAIL_DOCUMENT_DELETED, [document.name, version])
		});
		if (auditTrail) {
			await service.addDocumentAudit(document.guid, Number(version), auditTrail, 'Delete');
		}

		return res.send(documentInfo);
	}

	return res.sendStatus(404);
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

export {
	addDocuments,
	addDocumentVersion,
	getDocument,
	getDocumentAndVersions,
	getFolder,
	updateDocuments,
	deleteDocumentVersion
};
