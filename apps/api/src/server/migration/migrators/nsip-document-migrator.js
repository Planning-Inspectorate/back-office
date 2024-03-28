import { DOCUMENT_TYPES } from '../../applications/constants.js';
import { databaseConnector } from '#utils/database-connector.js';
import { getCaseIdFromRef } from './utils.js';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('pins-data-model').Schemas.NSIPDocument[]} documents
 */
export const migrateNsipDocuments = async (documents) => {
	console.info(`Migrating ${documents.length} documents`);

	const documentVersions = documents.reduce((memo, documentVersion) => {
		const id = documentVersion.documentId;
		const version = documentVersion.version;

		if (!Object.hasOwn(memo, id)) memo[id] = {};
		if (!Object.hasOwn(memo[id], version)) memo[id][version] = [];

		memo[id][version].push(documentVersion);

		return memo;
	}, {});

	for (const document of documents) {
		let documentId = document.documentId;
		let filename = document.filename;

		const caseId = await getCaseIdFromRef(document.caseRef);
		const folderId = 15360349;

		if (isPDFRendition(document, documentVersions[document.documentId][document.version])) {
			documentId = `${documentId}-rendition`;
			filename = `${filename} (PDF)`;
		}

		const documentEntity = {
			guid: documentId,
			caseId,
			folderId,
			documentReference: document.documentReference,
			fromFrontOffice: false,
			documentType: DOCUMENT_TYPES.Document,
			createdAt: new Date(document.dateCreated)
		};
		await createDocument(documentEntity);

		const documentVersion = buildDocumentVersion(document);
		await createDocumentVersion(documentVersion);
	}

	// for (const [documentGuid, documentVersionModels] of Object.entries(groupedDocumentModels)) {
	// 	const { caseRef, horizonFolderId, documentReference } = first(documentVersionModels);
	//
	// 	const caseId = await getCaseIdFromRef(caseRef);
	//
	// 	const document = {
	// 		guid: documentGuid,
	// 		caseId,
	// 		folderId: Number(horizonFolderId),
	// 		documentReference,
	// 		fromFrontOffice: false,
	// 		documentType: DOCUMENT_TYPES.Document // TODO handle DOCUMENT_TYPES.S51Attachment
	// 	};
	//
	// 	console.log(`Creating Document with guid ${document.guid}`);
	// 	await databaseConnector.document.upsert({
	// 		where: {
	// 			guid: document.guid
	// 		},
	// 		create: document,
	// 		update: document
	// 	});
	//
	// 	for (const documentVersionModel of documentVersionModels) {
	// 		const documentVersion = buildDocumentVersion(document, documentVersionModel);
	//
	// 		console.log(
	// 			`Creating DocumentVersion ${documentVersion.documentGuid}, ${documentVersion.version}`
	// 		);
	// 		await databaseConnector.documentVersion.upsert({
	// 			where: {
	// 				documentGuid_version: {
	// 					documentGuid: documentVersion.documentGuid,
	// 					version: documentVersion.version
	// 				}
	// 			},
	// 			create: documentVersion,
	// 			update: documentVersion
	// 		});
	// 	}
	//
	// 	const latestVersionId = last(documentVersionModels)?.version;
	// 	console.log(`Updating Document ${documentGuid} with latestVersionId ${latestVersionId}`);
	// 	await update(documentGuid, { latestVersionId });
	// }
};

const createDocument = async (documentEntity) =>
	databaseConnector.document.upsert({
		where: {
			guid: documentEntity.guid
		},
		create: documentEntity,
		update: documentEntity
	});

const createDocumentVersion = async (documentVersion) =>
	databaseConnector.documentVersion.upsert({
		where: {
			documentGuid_version: {
				documentGuid: documentVersion.documentGuid,
				version: documentVersion.version
			}
		},
		create: documentVersion,
		update: documentVersion
	});

const buildDocumentVersion = (document) => {
	const uri = new URL(document.documentURI);
	const match = uri.pathname.match(/^\/document-service-uploads(\/.*)$/);
	if (!match) {
		throw new Error('no path match');
	}
	const privateBlobPath = match[1];
	const isPublished = document.publishedStatus === 'published';
	const mime = document.mime ? MIMEs[document.mime] : extractMime(document.documentURI);
	const version = parseInt(document.version);

	return {
		version,
		documentType: document.documentType,
		sourceSystem: document.sourceSystem,
		origin: document.origin,
		originalFilename: document.originalFilename,
		representative: document.representative,
		description: document.description,
		owner: document.owner,
		author: document.author,
		securityClassification: document.securityClassification,
		mime,
		fileMD5: document.fileMD5,
		virusCheckStatus: document.virusCheckStatus,
		size: parseInt(document.size),
		filter1: document.filter1,
		dateCreated: new Date(document.dateCreated),
		datePublished: new Date(document.datePublished),
		examinationRefNo: document.examinationRefNo,
		filter2: document.filter2,
		publishedStatus: document.publishedStatus,
		redactedStatus: document.redactedStatus,
		documentGuid: document.documentId,
		published: isPublished,
		fileName: document.filename,
		horizonDataID: document.documentId,
		stage: document.documentCaseStage,
		redacted: document.redactedStatus === 'redacted',
		privateBlobContainer: 'document-service-uploads',
		privateBlobPath
		// TODO
		// publishedBlobContainer: isPublished ? 'published-documents' : null,
		// publishedBlobPath: isPublished ? 'TODO' : null
	};
};

const isPDFRendition = (document, versions) =>
	versions.length === 2 &&
	(document.mime === 'pdf' || document.originalFilename.toLowerCase().endsWith('.pdf'));

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
