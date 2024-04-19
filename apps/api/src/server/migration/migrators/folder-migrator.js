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
	if (existingFolders.length > 0)
		throw Error(`Default Folders already created for case ${caseReference}`);

	await Promise.all(folderRepository.createFolders(caseId, defaultCaseFoldersForMigration));
};
