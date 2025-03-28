// @ts-nocheck
import logger from '#utils/logger.js';
import {
	createFolder,
	getFolderByName
} from '../../applications/application/file-folders/folders.service.js';
import { getByRef as getCaseByRef } from '#repositories/case.repository.js';
import * as documentRepository from '#repositories/document.repository.js';
import {
	getHtmlDocumentVersions,
	processHtml,
	uploadNewFileVersion,
	downloadHtmlBlob
} from './cleanup/htmlTemplates.js';
import { databaseConnector } from '#utils/database-connector.js';
import { createDocumentVersion } from '../../applications/application/documents/document.service.js';

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const migrationCleanup = async (req, res) => {
	const caseReference = req.body.caseReference;
	const skipHtmlTransform = req.body.skipHtmlTransform;

	res.writeHead(200, { 'Content-Type': 'text/plain', 'transfer-encoding': 'chunked' });
	res.write(`\nStarting migration cleanup for ${caseReference} ...\n`);
	res.flush();

	try {
		const caseId = await getCaseIdByRef(caseReference);
		await cleanupLooseS51Attachments(caseId, res);
		if (!skipHtmlTransform) {
			await convertOldHtmlToNewHtmlDocuments(caseId, res);
		}
		// note: any other cleanup tasks can be added here in the future
	} catch (error) {
		logger.error(`Error during migration cleanup: ${error}`);
		res.write(`Error during migration cleanup: ${error}\n`);
	} finally {
		res.write('Clean up successfully complete');
		res.end();
	}
};

const getCaseIdByRef = async (caseReference) => {
	const project = await getCaseByRef(caseReference);
	return project.id;
};

const cleanupLooseS51Attachments = async (caseId, res) => {
	const s51UnattachedFolderName = 'S51 Unattached';
	const archiveFolderName = 'Archived Documentation';
	const s51AdviceFolderName = 'S51 advice';
	res.write(`Starting to clean up loose s51 attachments...\n`);
	// get loose s51 attachments
	const { id: s51AdviceFolderId } = await getFolderByName(caseId, s51AdviceFolderName);
	const s51DocumentsToMove = await databaseConnector.$queryRaw`
	SELECT dv.documentGuid, dv.version
	FROM Document doc
		   LEFT JOIN S51AdviceDocument adv ON adv.documentGuid = doc.guid
		   JOIN DocumentVersion dv ON dv.documentGuid = doc.guid
	WHERE doc.folderId = ${s51AdviceFolderId}
	  AND adv.documentGuid IS NULL`;
	if (s51DocumentsToMove.length === 0) {
		res.write(`No loose s51 attachments found.\n`);
	}

	// get or create nested s51 unattached archive folder
	const archiveFolderDetails = await getFolderByName(caseId, archiveFolderName);
	const unattachedAdviceFolderDetails = await getFolderByName(caseId, s51UnattachedFolderName);
	const archiveFolderId = archiveFolderDetails?.id;
	let s51UnattachedFolderId = unattachedAdviceFolderDetails?.id;
	if (!s51UnattachedFolderId) {
		const { id } = await createFolder(caseId, s51UnattachedFolderName, archiveFolderId);
		s51UnattachedFolderId = id;
	}

	// move all loose docs to unattached s51 folder
	await documentRepository.updateDocumentsFolderId({
		destinationFolderId: s51UnattachedFolderId,
		destinationFolderStage: '0',
		documents: s51DocumentsToMove
	});

	res.write(`Cleaned up loose s51 attachments.\n`);
	res.flush();
};

const convertOldHtmlToNewHtmlDocuments = async (caseId, res) => {
	res.write(`Starting to convert old html documents to new html documents...\n`);
	res.flush();

	const htmlDocumentVersions = await getHtmlDocumentVersions(caseId);

	if (htmlDocumentVersions.length === 0) {
		res.write(`No old html documents found.\n`);
		return;
	}

	res.write(
		`Converting documents with ids: ${htmlDocumentVersions
			.map((doc) => doc.documentGuid)
			.join(', ')}\n`
	);

	let convertedCount = 0;
	await Promise.all(
		htmlDocumentVersions.map((htmlDocumentVersion) => {
			return downloadHtmlBlob(htmlDocumentVersion.privateBlobPath)
				.then((originalHtmlString) =>
					processHtml(htmlDocumentVersion.documentGuid, originalHtmlString, res)
				)
				.then((html) => {
					// exit early if this is already a new template
					if (!html) return
					convertedCount++;
					return uploadNewFileVersion(htmlDocumentVersion.privateBlobPath, html)
						.then((uploadFileVersionResponse) =>
							createDocumentVersion(
								{
									documentName: htmlDocumentVersion.originalFilename,
									documentSize: uploadFileVersionResponse.blobSize,
									documentType: htmlDocumentVersion.mime,
									folderId: htmlDocumentVersion.folderId,
									privateBlobPath: uploadFileVersionResponse.newBlobName,
									username: htmlDocumentVersion.owner
								},
								caseId,
								htmlDocumentVersion.documentGuid,
								true
							)
						);
				});
		})
	);
	res.write(`Converted ${convertedCount} of ${htmlDocumentVersions.length} documents.\n`);
};
