import { sortBy } from 'lodash-es';
import {
	getSessionFilesNumberOnList,
	setSessionFilesNumberOnList
} from '../../../lib/services/session.service.js';
import {
	getCaseDocumentationFilesInFolder,
	getCaseFolders
} from './applications-documentation.service.js';

/** @typedef {import('../applications-case.locals.js').ApplicationCaseLocals} ApplicationCaseLocals */
/** @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory */
/** @typedef {import('./applications-documentation.types').CaseDocumentationUploadProps} CaseDocumentationUploadProps */
/** @typedef {import('./applications-documentation.types').CaseDocumentationBody} CaseDocumentationBody */

/** @typedef {import('./applications-documentation.types').CaseDocumentationProps} CaseDocumentationProps */

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
 * @type {import('@pins/express').RenderHandler<CaseDocumentationProps, ApplicationCaseLocals, {}, {size?: string, number?: string}, {}>}
 */
export async function viewApplicationsCaseDocumentationFolder(request, response) {
	const { caseId, folderId } = response.locals;
	const number = Number.parseInt(request.query.number || '1', 10);
	const sizeInSession = getSessionFilesNumberOnList(request.session);
	const sizeInQuery =
		request.query?.size && !Number.isNaN(Number.parseInt(request.query.size, 10))
			? Number.parseInt(request.query.size, 10)
			: null;
	const size = sizeInQuery || sizeInSession || 50;

	setSessionFilesNumberOnList(request.session, size);

	// get all the sub folders in this folder
	const subFoldersUnordered = await getCaseFolders(caseId, folderId);
	const subFolders = sortBy(subFoldersUnordered, ['displayOrder']);

	// get all the files in this folder
	const documentationFiles = await getCaseDocumentationFilesInFolder(
		caseId,
		folderId,
		size,
		number - 1
	);

	const paginationDropdownItems = [...Array.from({ length: 5 }).keys()].map((index) => ({
		value: (1 + index) * 25,
		text: (1 + index) * 25,
		selected: (1 + index) * 25 === size
	}));
	const paginationButtons = {
		...(number === 1 ? {} : { previous: { href: `?number=${number - 1}&size=${size}` } }),
		...(number === documentationFiles.pageCount
			? {}
			: { next: { href: `?number=${number + 1}&size=${size}` } }),
		items: [...Array.from({ length: documentationFiles.pageCount }).keys()].map((index) => ({
			number: index + 1,
			href: `?number=${index + 1}&size=${size}`,
			current: index + 1 === number
		}))
	};

	const properties = {
		subFolders,
		documentationFiles,
		pagination: {
			dropdownItems: paginationDropdownItems,
			buttons: paginationButtons
		}
	};

	response.render(`applications/case-documentation/documentation-folder`, properties);
}

/**
 * Change properties for the documentation files
 *
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, CaseDocumentationBody, {}, {}>}
 */
export async function updateApplicationsCaseDocumentationFolder(request, response) {
	// console.log(request.body.selectedFilesIds);
	response.redirect('.');
}

/**
 * View the documentation upload page
 *
 * @type {import('@pins/express').RenderHandler<CaseDocumentationUploadProps, {}>}
 */
export async function viewApplicationsCaseDocumentationUpload(request, response) {
	response.render(`applications/case-documentation/upload`);
}
