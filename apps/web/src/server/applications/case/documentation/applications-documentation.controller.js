import { sortBy } from 'lodash-es';
import { url } from '../../../lib/nunjucks-filters/url.js';
import {
	getSessionFilesNumberOnList,
	setSessionFilesNumberOnList
} from '../../common/services/session.service.js';
import {
	deleteCaseDocumentationFile,
	deleteCaseDocumentationPublishinQueue,
	getCaseDocumentationFileInfo,
	getCaseDocumentationFilesInFolder,
	getCaseDocumentationReadyToPublish,
	getCaseFolders,
	updateCaseDocumentationFiles
} from './applications-documentation.service.js';
import {
	destroySessionFolderPage,
	getSessionFolderPage,
	setSessionFolderPage
} from './applications-documentation.session.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../applications-case.locals.js').ApplicationCaseLocals} ApplicationCaseLocals */
/** @typedef {import('../../applications.types').DocumentationCategory} DocumentationCategory */
/** @typedef {import('../../applications.types').DocumentationFile} DocumentationFile */
/** @typedef {import('../../common/services/session.service.js').SessionWithFilesNumberOnList} SessionWithFilesNumberOnList */
/** @typedef {import('./applications-documentation.types').CaseDocumentationUploadProps} CaseDocumentationUploadProps */
/** @typedef {import('./applications-documentation.types').CaseDocumentationBody} CaseDocumentationBody */
/** @typedef {import('./applications-documentation.types').CaseDocumentationProps} CaseDocumentationProps */
/** @typedef {import('./applications-documentation.types').PaginationButtons} PaginationButtons */
/** @typedef {import('../../applications.types').PaginatedResponse<DocumentationFile>} PaginatedDocumentationFiles */

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
 * @type {import('@pins/express').RenderHandler<CaseDocumentationProps, ApplicationCaseLocals, {}, {size?: string, number?: string}, {folderName: string}>}
 */
export async function viewApplicationsCaseDocumentationFolder(request, response) {
	const properties = await documentationFolderData(request, response);

	response.render(`applications/case-documentation/documentation-folder`, properties);
}

/**
 * Change properties for the documentation files
 *
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, CaseDocumentationBody, {size?: string, number?: string}, {folderName: string}>}
 */
export async function updateApplicationsCaseDocumentationFolder(request, response) {
	const { errors: validationErrors, body } = request;
	const { caseId } = response.locals;
	const { status, isRedacted, selectedFilesIds } = body;
	const redacted = typeof isRedacted === 'string' ? { redacted: isRedacted === '1' } : {};

	const properties = await documentationFolderData(request, response);

	const payload = {
		status,
		...redacted,
		items: (selectedFilesIds || []).map((guid) => ({ guid }))
	};
	const { errors: apiErrors } = await updateCaseDocumentationFiles(caseId, payload);

	if (validationErrors || apiErrors) {
		return response.render(`applications/case-documentation/documentation-folder`, {
			...properties,
			errors: validationErrors || apiErrors
		});
	}

	response.redirect('.');
}

/**
 * View the documentation upload page
 *
 * @type {import('@pins/express').RenderHandler<CaseDocumentationUploadProps, {}>}
 */
export async function viewApplicationsCaseDocumentationUpload(request, response) {
	response.render(`applications/case-documentation/documentation-upload`);
}

/**
 * View the documentation pages
 *
 * @type {import('@pins/express').RenderHandler<{documentationFile: DocumentationFile, warningText: string|null}, {}>}
 */
export async function viewApplicationsCaseDocumentationPages({ params }, response) {
	const { documentGuid, action } = params;
	const { caseId } = response.locals;

	const documentationFile = await getCaseDocumentationFileInfo(caseId, documentGuid);

	const isReadyToPublish = documentationFile.publishedStatus === 'ready_to_publish';
	const warningText = isReadyToPublish
		? 'This document is in the publishing queue ready to be published.'
		: null;

	response.render(`applications/case-documentation/documentation-${action}`, {
		documentationFile,
		warningText
	});
}

/**
 * Delete a document
 *
 * @type {import('@pins/express').RenderHandler<{message?: string, documentationFile?: DocumentationFile, errors?: ValidationErrors}, {}>}
 */
export async function updateApplicationsCaseDocumentationDelete(
	{ params, errors: validationErrors },
	response
) {
	const { documentGuid } = params;
	const { caseId } = response.locals;
	const documentationFile = await getCaseDocumentationFileInfo(caseId, documentGuid);

	const { errors } = validationErrors
		? { errors: validationErrors }
		: await deleteCaseDocumentationFile(caseId, documentGuid, documentationFile.fileName);

	if (errors) {
		return response.render(`applications/case-documentation/documentation-delete`, {
			documentationFile,
			errors
		});
	}

	response.render(`applications/case-documentation/documentation-success-banner`, {
		message: 'Document successfully deleted '
	});
}

/**
 * View a folder, showing files in the folder, and listing subfolders
 *
 * @type {import('@pins/express').RenderHandler<{documentationFiles: PaginatedDocumentationFiles, paginationButtons: PaginationButtons, backLink: string}, ApplicationCaseLocals, {}, {size?: string, number?: string}, {}>}
 */
export async function viewApplicationsCaseDocumentationPublishingQueue(request, response) {
	const number = Number.parseInt(request.query.number || '1', 10);
	const { caseId } = response.locals;

	const documentationFiles = await getCaseDocumentationReadyToPublish(caseId, number);

	const backLink = getSessionFolderPage(request.session) ?? url('document-category', { caseId });

	destroySessionFolderPage(request.session);

	const paginationButtons = {
		...(number === 1 ? {} : { previous: { href: `?number=${number - 1}` } }),
		...(number === documentationFiles.pageCount ? {} : { next: { href: `?number=${number + 1}` } }),
		items: [...Array.from({ length: documentationFiles.pageCount }).keys()].map((index) => ({
			number: index + 1,
			href: `?number=${index + 1}`,
			current: index + 1 === number
		}))
	};

	response.render(`applications/case-documentation/documentation-publish`, {
		documentationFiles,
		paginationButtons,
		backLink
	});
}

/**
 * Handle the removal of the documentation from the publishing queue
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {caseId: number, documentGuid: string}>}
 */
export async function removeApplicationsCaseDocumentationPublishingQueue(request, response) {
	const { caseId, documentGuid } = request.params;

	await deleteCaseDocumentationPublishinQueue(caseId, documentGuid);

	return response.redirect(url('documents-queue', { caseId }));
}

// Data for controllers

/**
 * Get all the data for the display folder page (used by POST and GET) to retrieve shared template properties
 *
 * @param {{params: {folderName: string}, query: {number?: string, size?: string}, session: SessionWithFilesNumberOnList}} request
 * @param {{locals: Record<string, any>}} response
 * @returns {Promise<CaseDocumentationProps>}
 */
const documentationFolderData = async (request, response) => {
	const { caseId, folderId } = response.locals;
	const { folderName } = request.params;
	const number = Number.parseInt(request.query.number || '1', 10);
	const sizeInSession = getSessionFilesNumberOnList(request.session);
	const sizeInQuery =
		request.query?.size && !Number.isNaN(Number.parseInt(request.query.size, 10))
			? Number.parseInt(request.query.size, 10)
			: null;
	const size = sizeInQuery || sizeInSession || 50;

	setSessionFilesNumberOnList(request.session, size);
	setSessionFolderPage(
		request.session,
		url('document-category', {
			caseId,
			documentationCategory: { id: folderId, displayNameEn: folderName }
		})
	);

	// get all the sub folders in this folder
	const subFoldersUnordered = await getCaseFolders(caseId, folderId);
	const subFolders = sortBy(subFoldersUnordered, ['displayOrder']);

	// get all the files in this folder
	const documentationFiles = await getCaseDocumentationFilesInFolder(
		caseId,
		folderId,
		size,
		number
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

	return {
		subFolders,
		documentationFiles,
		pagination: {
			dropdownItems: paginationDropdownItems,
			buttons: paginationButtons
		}
	};
};
