import { sortBy } from 'lodash-es';
import {
	getCaseDocumentationFilesInFolder,
	getCaseFolders
} from './applications-documentation.service.js';

/** @typedef {import('../applications-case.locals.js').ApplicationCaseLocals} ApplicationCaseLocals */
/** @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory */
/** @typedef {import('./applications-documentation.types').CaseDocumentationUploadProps} CaseDocumentationUploadProps */
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
 * @type {import('@pins/express').RenderHandler<DocumentationPageProps, ApplicationCaseLocals, {}, {}, {}>}
 */
export async function viewApplicationsCaseDocumentationFolder(request, response) {
	const { caseId, folderId } = response.locals;

	// get all the sub folders in this folder
	const subFoldersUnordered = await getCaseFolders(caseId, folderId);
	const subFolders = sortBy(subFoldersUnordered, ['displayOrder']);

	// TODO: get all the files in this folder
	const documentationFiles = await getCaseDocumentationFilesInFolder(caseId, folderId);

	/** @type { DocumentationPageProps }  */
	const properties = {
		subFolders,
		documentationFiles
	};

	response.render(`applications/case-documentation/documentation-folder`, properties);
}

/**
 * View the documentation upload page
 *
 * @type {import('@pins/express').RenderHandler<CaseDocumentationUploadProps, {}>}
 */
export async function viewApplicationsCaseDocumentationUpload(request, response) {
	response.render(`applications/case-documentation/upload`);
}
