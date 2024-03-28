import { getManyS51AdviceOnCase } from '#repositories/s51-advice.repository.js';
import { DOCUMENT_TYPES } from '../../applications/constants.js';
import { getCaseByRef } from '../../applications/application/application.service.js';
import { databaseConnector } from '#utils/database-connector.js';
import { getFolderByNameAndCaseId } from '#repositories/folder.repository.js';
import { getS51AdviceDocuments } from '../../applications/s51advice/s51-advice.service.js';
import { ref, document, adviceName } from './data.js';

async function run() {
	if (!ref) {
		throw new Error('provide a case reference');
	}
	console.log('case ref', ref);
	const project = await getCaseByRef(ref);
	if (!project) {
		throw new Error('not found');
	}
	const folder = await getFolderByNameAndCaseId(project.id, 'S51 advice');
	if (!folder) {
		throw new Error('S51 folder not found');
	}
	console.log(folder);
	const allS51Advice = await getManyS51AdviceOnCase({
		caseId: project.id,
		skipValue: 0,
		pageSize: 25
	});

	const specificAdvice = allS51Advice.find((s) => s.title === adviceName);
	console.log(specificAdvice);

	if (!specificAdvice) {
		throw new Error('S51 not found');
	}
	const docs = await getS51AdviceDocuments(project.id, specificAdvice.id);

	console.log('docs before', docs);

	/**
	 * @type {import('@prisma/client').Prisma.DocumentUncheckedCreateInput}
	 */
	const documentEntity = {
		guid: document.documentId,
		caseId: project.id,
		folderId: folder.id,
		documentReference: document.documentReference,
		fromFrontOffice: false,
		documentType: DOCUMENT_TYPES.S51Attachment,
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

	console.log('created document');

	const uri = new URL(document.documentURI);
	const match = uri.pathname.match(/^\/document-service-uploads(\/.*)$/);
	if (!match) {
		throw new Error('no path match');
	}
	const privateBlobPath = match[1];
	const isPublished = document.publishedStatus === 'published';

	/**
	 * @type {import('@prisma/client').Prisma.DocumentVersionUncheckedCreateInput}
	 */
	const documentVersion = {
		version: parseInt(document.version),
		documentType: document.documentType,
		sourceSystem: document.sourceSystem,
		origin: document.origin,
		originalFilename: document.originalFilename,
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

	console.log('created version');

	await databaseConnector.document.update({
		where: {
			guid: documentEntity.guid
		},
		data: {
			latestDocumentVersion: {
				connect: {
					documentGuid_version: {
						documentGuid: documentEntity.guid,
						version: parseInt(document.version)
					}
				}
			}
		}
	});

	console.log('linked latest version');

	const activityLog = await databaseConnector.documentActivityLog.findFirst({
		where: {
			documentGuid: documentEntity.guid
		}
	});
	if (activityLog === null) {
		await databaseConnector.documentActivityLog.create({
			data: {
				documentGuid: documentEntity.guid,
				version: parseInt(document.version),
				user: 'migration',
				status: 'uploaded'
			}
		});
		console.log('created activity log');
	}

	/**
	 * @type {import('@prisma/client').Prisma.S51AdviceDocumentCreateInput}
	 */
	const adviceDoc = {
		S51Advice: {
			connect: { id: specificAdvice.id }
		},
		Document: {
			connect: { guid: documentEntity.guid }
		}
	};

	await databaseConnector.s51AdviceDocument.upsert({
		where: {
			documentGuid: documentVersion.documentGuid
		},
		create: adviceDoc,
		update: adviceDoc
	});

	console.log('S51AdviceDocument created');

	console.log('path', privateBlobPath);
}

run().catch(console.error);

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
	if (str === null) {
		return str;
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
