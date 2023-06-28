import appealRepository from '../repositories/appeal.repository.js';
import { upsertCaseFolders } from '../repositories/folder.repository.js';
import { getDocumentsByAppealId } from '../repositories/document.repository.js';

/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.FolderTemplate} FolderTemplate */

/**
 * Returns a list of document paths available for the current Appeal
 * @param {number} appealId
 * @param {('appellantCase'|'lpaQuestionnaire'|null)} sectionName
 * @returns {Promise<Folder[]>}
 */
export const getDocumentsForAppeal = async (appealId, sectionName = null) => {
	const appeal = await getAppeal(appealId);
	if (!appeal) {
		return [];
	}

	const folderLayout = await upsertCaseFolders(appealId);
	const documents = await getDocumentsByAppealId(appealId);

	for (const folder of folderLayout) {
		// @ts-ignore
		folder.documents = documents.filter((d) => d.folderId === folder.id);
	}

	if (sectionName) {
		return folderLayout.filter((f) => f.path.indexOf(sectionName) >= 0);
	}

	return folderLayout;
};

/**
 * Returns the current appeal by reference
 * @param {number} appealId
 * @returns {Promise<import("../appeals/appeals").RepositoryGetByIdResultItem|void>}
 */
const getAppeal = async (appealId) => {
	const appeal = await appealRepository.getById(appealId);
	return appeal;
};
