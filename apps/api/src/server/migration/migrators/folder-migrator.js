import { getCaseIdFromRef } from './utils.js';
import * as folderRepository from '#repositories/folder.repository.js';
import { defaultCaseFoldersForMigration } from './folder/folder.js';

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const migrateFolders = async (log, caseReference) => {
	log.info(`Migrating Folders for case ${caseReference}`);

	const caseId = await getCaseIdFromRef(caseReference);
	if (!caseId) throw Error(`Case does not exist for caseReference ${caseReference}`);

	const existingFolders = await folderRepository.getAllByCaseId(caseId);
	const foldersToCreate = await removeAlreadyExistingFolders(existingFolders);
	await Promise.all(folderRepository.createFolders(caseId, foldersToCreate));
};

const removeAlreadyExistingFolders = async (existingFolders) => {
	return defaultCaseFoldersForMigration.filter(
		(mandatoryFolder) =>
			!existingFolders.some(
				(existingFolder) => existingFolder.displayNameEn === mandatoryFolder.displayNameEn
			)
	);
};
