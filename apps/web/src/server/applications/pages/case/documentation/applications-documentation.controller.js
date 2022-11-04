import { sortBy } from 'lodash-es';
import {
	getCaseDocumentationCategories,
	getCaseDocumentationFilesInFolder,
	getCaseDocumentationFolderTree
} from '../../../lib/services/case.service.js';

/** @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory */
/** @typedef {import('./applications-documentation.types').DocumentationPageProps} DocumentationPageProps */

/**
 * View the documentation for a single case
 *
 * @type {import('@pins/express').RenderHandler<{documentationCategories: DocumentationCategory[]}, {}>}
 */
export async function viewApplicationsCaseDocumentationCategories(request, response) {
	const { caseId } = response.locals;
	const documentationCategories = await getCaseDocumentationCategories(caseId);
	const properties = { documentationCategories: sortBy(documentationCategories, ['displayOrder']) };

	response.render(`applications/case/project-documentation`, properties);
}

/**
 * View a folder, showing files in the folder, and listing subfolders
 *
 * @param {*} request
 * @param {*} response
 */
export async function viewApplicationsCaseDocumentationFolder(request, response) {
	const { caseId } = response.locals;
	const { folderId } = request.params;
	const topLevelDocumentationCategories = await getCaseDocumentationCategories(caseId);
	const currentFolderProperties = {
		topDocumentationCategories: sortBy(topLevelDocumentationCategories, ['displayOrder'])
	};
	const currentFileCategory = currentFolderProperties.topDocumentationCategories.find(
		(cat) => cat.id === Number.parseInt(folderId, 10)
	);

	// TODO: get all the sub folders in this folder

	/** @type { DocumentationPageProps }  */
	const properties = {
		caseId,
		currentFolder: currentFileCategory ?? null,
		folderTree: null,
		documentationFiles: null
	};

	// get the folderTree for breadcrumbing
	properties.folderTree = getCaseDocumentationFolderTree(caseId, currentFileCategory);

	// and get all the files in this folder
	properties.documentationFiles = getCaseDocumentationFilesInFolder(caseId, currentFileCategory);

	response.render(`applications/case-documentation/project-documentation-folder`, properties);
}
