import { DOCUMENT_TYPES } from '../../applications/constants.js';
import { getCaseByRef } from '../../applications/application/application.service.js';
import { databaseConnector } from '#utils/database-connector.js';
import { getFolderByNameAndCaseId } from '#repositories/folder.repository.js';
import { readCsv } from './read-csv.js';

/**
 * Run a docs migration from a local CSV file
 */
async function run() {
	const ref = process.argv[2];
	const fileName = process.argv[3];

	if (!ref) {
		throw new Error('provide a case reference');
	}

	if (!fileName) {
		throw new Error('provide a file name');
	}

	console.log({ ref, fileName });

	const project = await getCaseByRef(ref);
	if (!project) {
		throw new Error('not found');
	}

	const rows = await readCsv(fileName);
	console.log('rows', rows.length);

	for (const document of rows) {
		if (document.path.includes('Section 51 Advice')) {
			continue; // skip S51 advice docs
		}
		await migrateDoc(project.id, document);
	}

	console.log('processed', rows.length, 'documents');
}

run().catch(console.error);

// crude folder mappings
const folderMappings = new Map([
	['01 - Project Management', 'Project management'],
	['04 - Transboundary/01 - First Screening', 'First screening'],
	['05 - Pre-App/02 - EIA/02 - Scoping', 'Scoping'],
	['05 - Pre-App/02 - EIA/02 - Scoping/01 - Responses/28 Day Responses', 'Responses'],
	['05 - Pre-App/02 - EIA/02 - Scoping/01 - Responses/Late Responses', 'Responses'],
	['05 - Pre-App/02 - EIA/02 - Scoping/consultation emails', 'Scoping'],
	['05 - Pre-App/06 - Meetings', 'Events / meetings'],
	['05 - Pre-App/06 - Meetings/02 - Drafts', 'Events / meetings']
]);
const foldersToMap = [...folderMappings.keys()];

/**
 * Create a document + document version for the data given
 * @param {number} caseId
 * @param {*} document
 */
async function migrateDoc(caseId, document) {
	console.log('migrate', document.documentId, document.version, document.filename);

	const folderSuffixes = foldersToMap.filter((f) => document.path.endsWith(f));
	if (folderSuffixes.length === 0) {
		throw new Error(`no mapping for path: ${document.path}`);
	}
	if (folderSuffixes.length > 1) {
		throw new Error(`too many mappings for path: ${document.path}`);
	}
	const folder = await getFolderByNameAndCaseId(caseId, folderMappings.get(folderSuffixes[0]));

	if (!folder) {
		throw new Error(`can't find folder`);
	}
	/**
	 * @type {import('@prisma/client').Prisma.DocumentUncheckedCreateInput}
	 */
	const documentEntity = {
		guid: document.documentId,
		caseId: caseId,
		folderId: folder.id,
		documentReference: document.documentReference,
		fromFrontOffice: false,
		documentType: DOCUMENT_TYPES.Document,
		createdAt: toDate(document.dateCreated)
	};

	if (!isValidDate(documentEntity.createdAt)) {
		throw new Error(`invalid date: ${document.dateCreated}`);
	}

	await databaseConnector.document.upsert({
		where: {
			guid: documentEntity.guid
		},
		create: documentEntity,
		update: documentEntity
	});

	// console.log('upsert document');

	const uri = new URL(document.documentURI);
	const match = uri.pathname.match(/^\/document-service-uploads(\/.*)$/);
	if (!match) {
		throw new Error('no path match');
	}
	const privateBlobPath = match[1];
	const isPublished = document.publishedStatus === 'published';

	const version = parseInt(document.version);
	/**
	 * @type {import('@prisma/client').Prisma.DocumentVersionUncheckedCreateInput}
	 */
	const documentVersion = {
		version,
		documentType: document.documentType,
		sourceSystem: document.sourceSystem,
		origin: document.origin,
		originalFilename: document.filename, // document.originalFilename,
		representative: document.representative,
		description: document.description,
		owner: document.owner,
		author: document.author,
		securityClassification: document.securityClassification,
		mime: document.mime,
		fileMD5: document.fileMD5,
		virusCheckStatus: document.virusCheckStatus,
		size: parseInt(document.size),
		filter1: document.filter1,
		dateCreated: toDate(document.dateCreated),
		datePublished: toDate(document.datePublished),
		examinationRefNo: document.examinationRefNo,
		filter2: document.filter2,
		publishedStatus: document.publishedStatus,
		redactedStatus: document.redactedStatus,
		documentGuid: documentEntity.guid,
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

	await databaseConnector.documentVersion.upsert({
		where: {
			documentGuid_version: {
				documentGuid: documentVersion.documentGuid,
				version: documentVersion.version
			}
		},
		create: documentVersion,
		update: documentVersion
	});

	/**
	 * @type {import('@prisma/client').Prisma.DocumentActivityLogCreateInput}
	 */
	const activityLog = {
		documentGuid: documentEntity.guid,
		version,
		user: 'migration',
		status: 'uploaded',
		createdAt: toDate(document.lastModified)
	};
	const existingActivityLog = await databaseConnector.documentActivityLog.findFirst({
		where: {
			documentGuid: documentEntity.guid,
			version: version
		}
	});

	// activity log entry needed for the UI to work
	if (existingActivityLog === null) {
		await databaseConnector.documentActivityLog.create({
			data: activityLog
		});
		console.log('created activity log');
	} else {
		await databaseConnector.documentActivityLog.update({
			where: { id: existingActivityLog.id },
			data: activityLog
		});
	}

	const doc = await databaseConnector.document.findUnique({
		where: { guid: documentEntity.guid },
		select: {
			latestDocumentVersion: true
		}
	});

	// update latest version if this one is newer
	const existingLatestVersion = doc?.latestDocumentVersion?.version;
	if (!existingLatestVersion || version > existingLatestVersion) {
		console.log('update latest version', { existingLatestVersion, version });
		await databaseConnector.document.update({
			where: {
				guid: documentEntity.guid
			},
			data: {
				latestDocumentVersion: {
					connect: {
						documentGuid_version: {
							documentGuid: documentEntity.guid,
							version: version
						}
					}
				}
			}
		});
	}
}

/**
 * @param {Date|any} d
 * @returns {boolean}
 */
function isValidDate(d) {
	return d instanceof Date && !isNaN(d.getTime());
}

/**
 *
 * @param {string|null} str
 * @returns {Date|null}
 */
function toDate(str) {
	if (str === null || str === '') {
		return null;
	}
	const parts = str.split(' ');
	let [d, m, y] = parts[0].split('/');
	let [h, min, s] = parts[1].split(':');

	return new Date(
		parseInt(y),
		parseInt(m) - 1,
		parseInt(d),
		parseInt(h),
		parseInt(min),
		parseInt(s) || 0
	);
}
