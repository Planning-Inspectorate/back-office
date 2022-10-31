// TODO: move shared stuff into a local file as this expands - from PR 607: https://github.com/Planning-Inspectorate/back-office/pull/607
import { sortBy } from 'lodash-es';
import {
	getCaseDocumentationFilesInFolder,
	getCaseDocumentationFolderPath,
	getCaseFolder,
	getCaseFolders
} from './applications-documentation.service.js';

/** @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory */
/** @typedef {import('./applications-documentation.types').DocumentationPageProps} DocumentationPageProps */

/**
 * View the documentation for a single case - the top level folders
 *
 * @type {import('@pins/express').RenderHandler<{documentationCategories: DocumentationCategory[]}, {}>}
 */
export async function viewApplicationsCaseDocumentationCategories(request, response) {
	const { caseId } = response.locals;
	const documentationCategories = await getCaseFolders(caseId);
	const properties = { documentationCategories: sortBy(documentationCategories, ['displayOrder']) };

	response.render(`applications/case/project-documentation`, properties);
}

/**
 * View a folder, showing files in the folder, and listing subfolders
 *
 * @type {import('@pins/express').RenderHandler<DocumentationPageProps, {}, {}, {}, {folderId: number}>}
 */
export async function viewApplicationsCaseDocumentationFolder(request, response) {
	const { caseId } = response.locals;
	const { folderId } = request.params;
	const currentFileCategory = await getCaseFolder(caseId, folderId);

	// get all the sub folders in this folder
	const subFoldersUnordered = await getCaseFolders(caseId, folderId);
	const subFolders = sortBy(subFoldersUnordered, ['displayOrder']);

	/** @type { DocumentationPageProps }  */
	const properties = {
		caseId,
		currentFolder: currentFileCategory ?? null,
		subFolders,
		folderPath: null,
		documentationFiles: null
	};

	// get the folderTree for breadcrumbing
	properties.folderPath = await getCaseDocumentationFolderPath(caseId, folderId);

	// TODO: and get all the files in this folder
	properties.documentationFiles = getCaseDocumentationFilesInFolder(caseId, currentFileCategory);

	response.render(`applications/case-documentation/project-documentation-folder`, properties);
}

/**
 * View the documentation upload page
 *
 * @type {import('@pins/express').RenderHandler<{currentFolder: string}, {}>}
 */
export async function viewApplicationsCaseDocumentationUpload(request, response) {
	const properties = { currentFolder: 'Subfolder Placeholder' };

	response.render(`applications/documentation/upload`, properties);
}
