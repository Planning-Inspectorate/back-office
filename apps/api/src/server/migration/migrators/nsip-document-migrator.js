import { DOCUMENT_TYPES, DOCUMENT_VERSION_TYPES } from '../../applications/constants.js';

import { databaseConnector } from '#utils/database-connector.js';
import { getCaseIdFromRef } from './utils.js';
import { map, uniq } from 'lodash-es';
import { getDocumentFolderId } from './folder/folder.js';
import logger from '#utils/logger.js';
import { broadcastNsipDocumentEvent } from '#infrastructure/event-broadcasters.js';
import { EventType } from '@pins/event-client/src/event-type.js';
import { removeMultipleSpacesAndTrim, trimDocumentNameKnownSuffix } from '#utils/file-fns.js';

/**
 * Convert HZN Document Version DocumentType to CBOS Document Version DocumentType
 */
const hznDocVersionTypes = {
	'DCO decision letter (SoS)(approve)': DOCUMENT_VERSION_TYPES.DCODecisionLetterApprove,
	'DCO decision letter (SoS)(refuse)': DOCUMENT_VERSION_TYPES.DCODecisionLetterRefuse,
	'Recording of preliminary meeting': DOCUMENT_VERSION_TYPES.EventRecording,
	'Recording of hearing': DOCUMENT_VERSION_TYPES.EventRecording,
	'Rule 6 letter - notification of the preliminary meeting and matters to be discussed':
		DOCUMENT_VERSION_TYPES.Rule6Letter,
	'Rule 6 letter - notification of the preliminary meeting and matters to be discussed (Welsh)':
		DOCUMENT_VERSION_TYPES.Rule6Letter,
	'Rule 8 letter - notification of timetable for the examination':
		DOCUMENT_VERSION_TYPES.Rule8Letter,
	'Rule 8 letter - notification of timetable for the examination (Welsh)':
		DOCUMENT_VERSION_TYPES.Rule8Letter,
	'Examination Library': DOCUMENT_VERSION_TYPES.ExamLibrary,
	Library: DOCUMENT_VERSION_TYPES.ExamLibrary
};

/**
 * Handle an HTTP trigger/request to run the migration.
 * Migrates NSIP documents
 *
 * @param {import("pins-data-model").Schemas.NSIPDocument[]} documents
 * @param {Function} updateProgress
 */
export const migrateNsipDocuments = async (documents, updateProgress) => {
	logger.info(`Migrating ${documents.length} documents`);

	const caseRefs = uniq(map(documents, 'caseRef'));
	if (caseRefs.length !== 1) throw 'Expected only documents for single caseRef';
	const caseId = await getCaseIdFromRef(caseRefs[0]);

	// documents are processed in version order, with each original upload before its PDF rendition (if any)
	// ie are going to make original v1 => v1, rendition v1 => v2, original v2 => v3, rendition v2 => v4 etc.

	// After Apr 2025 change to HZN View and ODW, both originalFileName and filename (ie the displayed and editable title) are separate incoming fields now
	let parentDocumentId = null;
	let versionNumber = 1;
	for (const [index, document] of documents.entries()) {
		const folderId = await getDocumentFolderId(document, caseId);
		let documentId = document.documentId;
		// take HZN display name and trim off file suffix if in known list. and then trim and remove any multiple spaces
		let documentFilename = removeMultipleSpacesAndTrim(
			trimDocumentNameKnownSuffix(document.filename)
		);
		if (documentId !== parentDocumentId) {
			// new doc to process
			parentDocumentId = documentId;
			versionNumber = document.version; // start at the same HZN version number
		} else {
			// new version of the same doc as previous, so increment the version number
			versionNumber++;
		}

		const documentEntity = {
			guid: documentId,
			caseId,
			folderId,
			documentReference: document.documentReference || `${document.caseRef}-M-${documentId}`,
			fromFrontOffice: false,
			documentType: isS51Advice(document) ? DOCUMENT_TYPES.S51Attachment : DOCUMENT_TYPES.Document,
			createdAt: new Date(document.dateCreated)
		};
		await upsertDocument(documentEntity);

		const documentVersion = buildDocumentVersion(
			documentEntity.guid,
			versionNumber,
			documentFilename,
			document
		);

		await createDocumentVersion(documentVersion);
		await handleCreationOfDocumentActivityLogs(documentVersion);
		updateProgress(index, documents.length);
	}
	await updatePreviousVersionsToUnpublished(caseId);
	await updateLatestVersionId(caseId);
	await broadcastAllPublishedDocuments(caseId);
};

/**
 * Upsert the Document record
 *
 * @param {*} documentEntity
 */
const upsertDocument = async (documentEntity) => {
	logger.info(`Creating / Updating Document ${documentEntity.guid}`);
	await databaseConnector.document.upsert({
		where: {
			guid: documentEntity.guid
		},
		create: documentEntity,
		update: documentEntity
	});
};

/**
 * Upsert the DocumentVersion record
 *
 * @param {*} documentVersion
 * @returns
 */
export const createDocumentVersion = async (documentVersion) => {
	logger.info(
		`Creating / Updating DocumentVersion ${documentVersion.documentGuid}, ${documentVersion.version}`
	);
	return await databaseConnector.documentVersion.upsert({
		where: {
			documentGuid_version: {
				documentGuid: documentVersion.documentGuid,
				version: documentVersion.version
			}
		},
		create: documentVersion,
		update: documentVersion,
		include: {
			Document: {
				include: {
					folder: {
						include: {
							case: {
								include: {
									CaseStatus: true
								}
							}
						}
					}
				}
			}
		}
	});
};

/**
 *
 * @param {object} documentVersion
 */
export const handleCreationOfDocumentActivityLogs = async (documentVersion) => {
	await createDocumentActivityLog({
		documentGuid: documentVersion.documentGuid,
		version: documentVersion.version,
		status: 'uploaded',
		activityDate: documentVersion.dateCreated
	});
	if (documentVersion.datePublished) {
		await createDocumentActivityLog({
			documentGuid: documentVersion.documentGuid,
			version: documentVersion.version,
			status: 'published',
			activityDate: documentVersion.datePublished
		});
	}
};

const createDocumentActivityLog = async ({ documentGuid, version, status, activityDate }) => {
	/**
	 * @type {import("@prisma/client").Prisma.DocumentActivityLogCreateInput}
	 */
	const activityLog = {
		documentGuid,
		version,
		user: 'migration',
		status,
		createdAt: new Date(activityDate)
	};
	const existingActivityLog = await databaseConnector.documentActivityLog.findFirst({
		where: {
			documentGuid,
			version,
			status
		}
	});
	if (existingActivityLog === null) {
		logger.info(`Creating DocumentActivityLog ${documentGuid}, ${version}`);
		await databaseConnector.documentActivityLog.create({
			data: activityLog
		});
	} else {
		logger.info(`Updating DocumentActivityLog ${documentGuid}, ${version}`);
		await databaseConnector.documentActivityLog.update({
			where: { id: existingActivityLog.id },
			data: activityLog
		});
	}
};

/**
 * Bulk SQL update the latestVersionId for all Document records on a case by checking the latest version of each
 *
 * @param {number |undefined} caseId
 */
const updateLatestVersionId = async (caseId) => {
	logger.info('Setting latestVersionId for all Documents');
	const statement = `UPDATE Document
					 SET Document.latestVersionId = (SELECT MAX(DocumentVersion.version)
													 FROM DocumentVersion
													 WHERE Document.guid = DocumentVersion.documentGuid)
					 WHERE caseId = @P1;`;
	await databaseConnector.$executeRawUnsafe(statement, caseId);
};

/**
 * Bulk update all previous documentVersions to unpublished where a more recent version is unpublished
 * @param {number |undefined} caseId
 * @returns {Promise<void>}
 */
const updatePreviousVersionsToUnpublished = async (caseId) => {
	const documents = await databaseConnector.document.findMany({
		where: { caseId: caseId },
		include: {
			documentVersion: true
		}
	});

	if (!documents.length) return;
	const updates = [];

	for (const doc of documents) {
		const unpublishedVersions = doc.documentVersion.filter(
			(v) => v.publishedStatus === 'unpublished'
		);
		if (!unpublishedVersions.length) continue;
		const highestUnpublishedVersionNumber = Math.max(...unpublishedVersions.map((v) => v.version));
		if (highestUnpublishedVersionNumber === 1) continue;

		updates.push(
			databaseConnector.documentVersion.updateMany({
				where: {
					documentGuid: doc.guid,
					version: {
						lt: highestUnpublishedVersionNumber
					},
					publishedStatus: 'published'
				},
				data: {
					publishedStatus: 'unpublished'
				}
			})
		);
	}

	if (updates.length > 0) {
		await databaseConnector.$transaction(updates);
	}
};

/**
 * Broadcast publish document versions for caseId
 * @param {number |undefined} caseId
 * @returns {Promise<void>}
 */
const broadcastAllPublishedDocuments = async (caseId) => {
	const documents = await databaseConnector.document.findMany({
		where: { caseId: caseId },
		include: {
			documentVersion: true
		}
	});

	if (!documents.length) return;

	for (const doc of documents) {
		const publishedVersions = doc.documentVersion.filter((v) => v.publishedStatus === 'published');
		if (!publishedVersions.length) continue;
		const highestPublishedVersion = publishedVersions.reduce(
			(max, version) => (version.version > max.version ? version : max),
			publishedVersions[0]
		);
		const documentForServiceBus = await createDocumentVersion(highestPublishedVersion);
		await broadcastNsipDocumentEvent(documentForServiceBus, EventType.Update, {
			publishing: 'true',
			migrationPublishing: 'true'
		});
	}
};

/**
 * Create the DocumentVersion record for a migrating document
 *
 * @param {string} documentGuid
 * @param {number} versionNumber
 * @param {string} documentFilename
 * @param {*} document
 * @returns
 */
export const buildDocumentVersion = (documentGuid, versionNumber, documentFilename, document) => {
	const uri = new URL(document.documentURI);
	const match = uri.pathname.match(/^\/document-service-uploads(\/.*)$/);
	if (!match) throw new Error('no path match');
	const privateBlobPath = match[1];
	const isPublished = document.publishedStatus === 'published';
	const mime = document.mime ? MIMEs[document.mime] : extractMime(document.documentURI);
	let docTypeInDocumentVersion = null;
	if (document.documentType) {
		if (Object.hasOwn(hznDocVersionTypes, document.documentType)) {
			docTypeInDocumentVersion = hznDocVersionTypes[document.documentType];
		}
	}

	return {
		version: versionNumber,
		documentType: docTypeInDocumentVersion,
		sourceSystem: document.sourceSystem,
		origin: document.origin,
		originalFilename: document.originalFilename,
		fileName: documentFilename, // the displayed file title, same for all versions
		representative: document.representative,
		description: document.description,
		descriptionWelsh: document.descriptionWelsh,
		owner: document.owner,
		author: document.author,
		authorWelsh: document.authorWelsh,
		securityClassification: document.securityClassification,
		mime,
		fileMD5: document.fileMD5,
		virusCheckStatus: document.virusCheckStatus,
		size: parseInt(document.size),
		filter1: document.filter1,
		filter1Welsh: document.filter1Welsh,
		dateCreated: new Date(document.dateCreated),
		datePublished: document.datePublished ? new Date(document.datePublished) : null,
		examinationRefNo: document.examinationRefNo,
		filter2: document.filter2,
		publishedStatus: document.publishedStatus,
		redactedStatus: document.redactedStatus,
		documentGuid,
		published: isPublished,
		horizonDataID: document.documentId,
		stage: document.documentCaseStage,
		redacted: document.redactedStatus === 'redacted',
		privateBlobContainer: 'document-service-uploads',
		privateBlobPath
	};
};

const isS51Advice = (document) => document.path.includes('Section 51 Advice');

const MIMEs = {
	pdf: 'application/pdf',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	ppt: 'application/vnd.ms-powerpoint',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	msg: 'application/vnd.ms-outlook',
	mpeg: 'video/mpeg',
	mp3: 'audio/mpeg',
	mp4: 'video/mp4',
	mov: 'video/quicktime',
	png: 'image/png',
	tiff: 'image/tiff',
	tif: 'image/tiff',
	html: 'text/html',
	prj: 'application/x-anjuta-project',
	dbf: 'application/dbf',
	shp: 'application/vnd.shp',
	shx: 'application/vnd.shx'
};

const extractMime = (uri) => {
	const parts = uri.split('/');
	const blobName = parts[parts.length - 1].toLowerCase();

	if (blobName.includes('.')) {
		const [, mime] = blobName.split('.');
		return mime;
	}
	// some real data ends with :PDF
	if (blobName.endsWith(':pdf')) {
		return 'pdf';
	}
};
