// @ts-nocheck
import logger from '#utils/logger.js';
import {
	createFolder,
	getFolderByName
} from '../../applications/application/file-folders/folders.service.js';
import { getByRef as getCaseByRef } from '#repositories/case.repository.js';
import { getByCaseId as getExamTimetableByCaseId } from '#repositories/examination-timetable.repository.js';
import * as documentRepository from '#repositories/document.repository.js';
import {
	getHtmlDocumentVersions,
	processHtml,
	uploadNewFileVersion,
	downloadHtmlBlob
} from './cleanup/htmlTemplates.js';
import { databaseConnector } from '#utils/database-connector.js';
import { createDocumentVersion } from '../../applications/application/documents/document.service.js';
import { formatInTimeZone } from 'date-fns-tz';

const EXAMINATION_STAGE = 'Examination';

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const migrationCleanup = async (req, res) => {
	const caseReference = req.body.caseReference;
	const skipLooseS51Attachments = req.body.skipLooseS51Attachments;
	const skipHtmlTransform = req.body.skipHtmlTransform;
	const skipFixExamFolders = req.body.skipFixExamFolders;

	res.writeHead(200, { 'Content-Type': 'text/plain', 'transfer-encoding': 'chunked' });
	res.write(`\nStarting migration cleanup for ${caseReference} ...\n`);
	res.write(`Settings: : skipLooseS51Attachments: ${skipLooseS51Attachments}\n`);
	res.write(`Settings: : skipHtmlTransform: ${skipHtmlTransform}\n`);
	res.write(`Settings: : skipFixExamFolders: ${skipFixExamFolders}\n`);
	res.flush();

	try {
		const caseId = await getCaseIdByRef(caseReference);
		if (!skipLooseS51Attachments) {
			await cleanupLooseS51Attachments(caseId, res);
		}
		if (!skipHtmlTransform) {
			await convertOldHtmlToNewHtmlDocuments(caseId, res);
		}
		if (!skipFixExamFolders) {
			await correctExamTimetableFolders(caseId, res);
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

/**
 *
 * @param {string} caseReference
 * @returns number
 */
const getCaseIdByRef = async (caseReference) => {
	const project = await getCaseByRef(caseReference);
	return project.id;
};

/**
 * Move all unattached s51 attachments, in the wrong place, to an archive folder
 *
 * @param {number} caseId
 * @param {*} res
 */
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

/**
 * Convert all old HZN HTML documents that point to YouTube videos, to the new CBOS format
 * @param {number} caseId
 * @param {*} res
 * @returns
 */
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
					if (!html) return;
					convertedCount++;
					return uploadNewFileVersion(htmlDocumentVersion.privateBlobPath, html).then(
						(uploadFileVersionResponse) =>
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

/**
 * After migration, the exam timetable items were all incorrectly pointing to the main exam timetable folder,
 * this tries to match them to the correct folder for each exam item, and create the folder if it does not exist.
 * folder names are in old HZN format - <yyyymmdd> <item_name>.
 * Also corrects the folder stage, displayOrder and isCustom values on existing matching folders
 *
 * @param {number} caseId
 * @param {*} res
 * @returns
 */
const correctExamTimetableFolders = async (caseId, res) => {
	const examTimetableFolderName = 'Examination Timetable';

	res.write(`Starting to fix exam timetable folders for caseId ${caseId} ...\n`);

	// get the Examination Timetable main folder
	const { id: examTimetableFolderId } = await getFolderByName(caseId, examTimetableFolderName);
	if (!examTimetableFolderId) {
		res.write(`Examination Timetable folder with id ${examTimetableFolderId} does not exist.\n`);
		return;
	}
	res.write(`Examination Timetable folder with id ${examTimetableFolderId} found.\n`);

	const examTimetable = await getExamTimetableByCaseId(caseId);
	if (!examTimetable) {
		res.write(`Examination Timetable with id ${examTimetable.id} does not exist.\n`);
		return;
	}
	const examTimetableId = examTimetable.id;
	res.write(`Examination Timetable with id ${examTimetableId} found.\n`);
	// work through the exam timetable items
	const examTimetableItems = await databaseConnector.$queryRaw`
		SELECT *
		FROM ExaminationTimetableItem
		WHERE examinationTimetableId = ${examTimetableId} AND folderId = ${examTimetableFolderId}
	`;
	// res.write(`Examination Timetable Items ${JSON.stringify(examTimetableItems)}\n`);
	if (examTimetableItems.length === 0) {
		res.write(`No incorrect exam timetable items found.\n`);
		return;
	}
	res.write(
		`Examination Timetable Items with incorrect folder ids: ${examTimetableItems.length} found.\n`
	);

	// BST Summer time date issue:
	// exam timetable folders made by HZN are named using local date, but the migration process stores dates in UTC.
	// eg: exam timetable with date 13 Oct 2025 00:00:00 will be migrated into cbos as 12 Oct 2025 23:59:00 UTC.
	// so when we try to find matching folder here, we need to make into local time to search for folder <20251013 - Deadline Name>
	const timezone = 'Europe/London';
	const folderDateFormat = 'yyyyMMdd';

	for (const item of examTimetableItems) {
		const { id: itemId, folderId, name, date: itemDate } = item;
		// res.write(`Exam timetable item ${itemId} with folder id ${folderId} and name ${name} found.\n`);
		if (folderId === examTimetableFolderId) {
			res.write('----------------------------------------------------\n');
			res.write(
				`Examination timetable item ${itemId} ${name} incorrectly pointed to main timetable folder.\n`
			);

			// now try to see if the folder it should point to already exists
			res.write(
				`Checking if folder for ${itemDate
					.toISOString()
					.substr(0, 10)} in ${itemDate.toISOString()} exists...\n`
			);

			// CBOS format - proper CBOS folder names in format dd mmm yyyy - <item_name>
			// const folderNameCBOSFormat = `${formatDate(itemDate, true)} - ${name}`;

			// HZN format - Folder called "<yyyymmdd> <item_name>
			const formattedDate = formatInTimeZone(itemDate, timezone, folderDateFormat); // eg 20250131
			const expectedFolderName = `${formattedDate} ${name}`;

			//const expectedFolderName = `${name}`;
			const matchingFolder = await getFolderByName(
				caseId,
				expectedFolderName,
				examTimetableFolderId
			);

			if (!matchingFolder) {
				res.write(`Examination timetable item CBOS folder ${expectedFolderName} does not exist.\n`);

				res.write(`Creating folder ${expectedFolderName}...\n`);
				const newFolder = await createFolder(
					caseId,
					expectedFolderName,
					examTimetableFolderId,
					Number(formattedDate)
				);
				res.write(`Created folder ${JSON.stringify(newFolder)} with id ${newFolder.id}.\n`);

				// now correct the exam item to reference the new folder
				if (!newFolder) {
					res.write(`WARN ++++++++++: Failed to create folder ${expectedFolderName}.\n`);
				} else {
					res.write(`Updating timetable item ${itemId} to match folder to ${newFolder.id}.\n`);
					await databaseConnector.$executeRaw`
						UPDATE ExaminationTimetableItem
						SET folderId = ${newFolder.id}
						WHERE id = ${itemId}
					`;
					res.write(`Updated timetable item ${itemId} to match folder to ${newFolder.id}.\n`);
				}
			} else {
				// folder does exist - update the id in the timetable item to match it.
				res.write(
					`==== match found: Examination timetable item folder ${expectedFolderName} already exists - id ${matchingFolder.id}.\n`
				);
				// now correct the exam item to reference the correct folder
				res.write(
					`Updating timetable item ${itemId} to match folder to ${matchingFolder.id} ...\n`
				);
				await databaseConnector.$executeRaw`
					UPDATE ExaminationTimetableItem
					SET folderId = ${matchingFolder.id}
					WHERE id = ${itemId}
				`;
				res.write(`Updated timetable item ${itemId} to match folder to ${matchingFolder.id}.\n`);

				// and check the exam timetable item folder has the correct stage, displayOrder and isCustom set
				// stage = Examination, displayOrder = <formattedDate>, isCustom = false (bitfield 0)
				let folderUpdateRequired = false;
				let updateCodes = [];
				if (matchingFolder.stage !== EXAMINATION_STAGE) {
					folderUpdateRequired = true;
					updateCodes.push(`stage = '${EXAMINATION_STAGE}'`);
				}
				if (matchingFolder.displayOrder !== Number(formattedDate)) {
					folderUpdateRequired = true;
					updateCodes.push(`displayOrder = ${formattedDate}`);
				}
				if (matchingFolder.isCustom !== false) {
					folderUpdateRequired = true;
					updateCodes.push(`isCustom = 0`);
				}

				if (folderUpdateRequired) {
					const updateCodeLine = updateCodes.join(', ');
					const sqlUpdateCode = `UPDATE Folder SET ${updateCodeLine} WHERE id=${matchingFolder.id}`;
					res.write(
						`Updating folder ${matchingFolder.id} to SET: ${updateCodeLine} WHERE id = ${matchingFolder.id} ...\n`
					);
					try {
						// using executeRawUnsafe to allow for dynamic SQL - executeRaw does not process template strings
						await databaseConnector.$executeRawUnsafe(sqlUpdateCode);
						res.write(`Updated folder ${matchingFolder.id} to SET: ${updateCodeLine}.\n`);
					} catch (err) {
						// warn only, and continue with fixes
						res.write(
							`WARN ++++++++++: Failed to update exam folder ${matchingFolder.id}: ${err.message}\n`
						);
					}
				}
			}
		}
	}

	res.write(`Fixed exam timetable folders.\n`);
	res.flush();
};
