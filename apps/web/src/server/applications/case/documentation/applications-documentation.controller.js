import { sortBy } from 'lodash-es';
import { url } from '../../../lib/nunjucks-filters/url.js';
import {
	getSessionFilesNumberOnList,
	setSessionFilesNumberOnList
} from '../../common/services/session.service.js';
import { buildBreadcrumbItems } from '../applications-case.locals.js';
import {
	deleteCaseDocumentationFile,
	getCaseDocumentationFileInfo,
	getCaseDocumentationFilesInFolder,
	getCaseDocumentationFileVersions,
	getCaseDocumentationReadyToPublish,
	getCaseFolders,
	publishCaseDocumentationFiles,
	removeCaseDocumentationPublishingQueue,
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
		const apiErrorMessage = (apiErrors || [])[0]?.guid
			? { msg: 'You must fill in all mandatory document properties to publish a document' }
			: { msg: 'Something went wrong. Please, try again later.' };

		/** @type {DocumentationFile[]} */
		const allItems = properties.documentationFiles.items;
		const failedItems = allItems.map((file) => ({
			...file,
			failed: !!(apiErrors || []).some((failedItem) => failedItem.guid === file.documentGuid)
		}));

		properties.documentationFiles.items = failedItems;

		return response.render(`applications/case-documentation/documentation-folder`, {
			...properties,
			errors: validationErrors || apiErrorMessage,
			failedItems: apiErrors
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
 * View the documentation version upload page
 *
 * @type {import('@pins/express').RenderHandler<{documentationFile: DocumentationFile}, {}>}
 */
export async function viewApplicationsCaseDocumentationVersionUpload({ params }, response) {
	const { documentGuid } = params;
	const { caseId } = response.locals;

	const documentationFile = await getCaseDocumentationFileInfo(caseId, documentGuid);

	response.render(`applications/case-documentation/documentation-version-upload`, {
		documentationFile
	});
}

/**
 * View the documentation pages
 *
 * @type {import('@pins/express').RenderHandler<{documentationFile: DocumentationFile, warningText: string|null, documentVersionsRows: any[]}, {}>}
 */
export async function viewApplicationsCaseDocumentationPages({ params }, response) {
	const { documentGuid, action } = params;
	const { caseId } = response.locals;

	const documentationFile = await getCaseDocumentationFileInfo(caseId, documentGuid);
	const documentVersions = await getCaseDocumentationFileVersions(documentGuid);

	const documentVersionsRows = [];

	for (const documentVersion of documentVersions) {
		const row = [
			{ text: documentVersion.version },
			{ text: documentVersion.fileName },
			{ text: documentVersion.dateCreated },
			{ text: documentVersion.redacted }
		];

		documentVersionsRows.push(row);
	}

	const isReadyToPublish = documentationFile.publishedStatus === 'ready_to_publish';
	const warningText = isReadyToPublish
		? 'This document is in the publishing queue ready to be published.'
		: null;

	response.render(`applications/case-documentation/documentation-${action}`, {
		documentationFile,
		warningText,
		documentVersionsRows
	});
}

/**
 * Delete a document
 *
 * @type {import('@pins/express').RenderHandler<{documentationFile?: DocumentationFile, errors?: ValidationErrors} | {serviceName?: string, successMessage?: string}, {}>}
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
		serviceName: 'Document successfully deleted'
	});
}

/**
 * View a folder, showing files in the folder, and listing subfolders
 *
 * @type {import('@pins/express').RenderHandler<{documentationFiles: PaginatedDocumentationFiles, paginationButtons: PaginationButtons, backLink: string}, ApplicationCaseLocals, {}, {size?: string, number?: string}, {}>}
 */
export async function viewApplicationsCaseDocumentationPublishingQueue(request, response) {
	const currentPageNumber = Number.parseInt(request.query.number || '1', 10);
	const { caseId } = response.locals;
	const documentationFiles = await getCaseDocumentationReadyToPublish(caseId, currentPageNumber);
	const backLink = getSessionFolderPage(request.session) ?? url('document-category', { caseId });
	const paginationButtons = getPaginationButtonData(
		currentPageNumber,
		documentationFiles.pageCount
	);

	response.render(`applications/case-documentation/documentation-publish`, {
		documentationFiles,
		paginationButtons,
		backLink
	});
}

/**
 * Send publishing request for selected documents
 *
 * @param {*} request
 * @param {*} response
 * @type {import('@pins/express').RenderHandler<{documentationFiles: DocumentationFile[], backLink: any, paginationButtons: any, errors?: ValidationErrors |string} | {serviceName: string, successMessage: string}, {}>}
 */
export async function updateApplicationsCaseDocumentationPublish(request, response) {
	const currentPageNumber = Number.parseInt(request.query.number || '1', 10);
	const { caseId } = response.locals;
	const { selectedFilesIds } = request.body;
	const { errors: validationErrors, session } = request;

	// convert the array of ids into format that the API expects.
	// incoming:  [ 'guid-1', 'guid-2']
	// API wants: [ { guid: 'guid-1'}, { guid: 'guid-2'} ]
	const items = (selectedFilesIds || []).map((/** @type {string} */ item) => {
		const container = { guid: item };

		return container;
	});

	const tryPublish = await publishCaseDocumentationFiles(caseId, items);
	const { errors } = tryPublish;

	const backLinkFolder = getSessionFolderPage(session) ?? '';
	const backLink = backLinkFolder ?? url('document-category', { caseId });

	// re-display publishing queue page, with error messages
	if (validationErrors || errors) {
		// need to get the info on the current publishing page to re-display it
		const documentationFiles = await getCaseDocumentationReadyToPublish(caseId, currentPageNumber);
		const paginationButtons = getPaginationButtonData(
			currentPageNumber,
			documentationFiles.pageCount
		);

		return response.render(`applications/case-documentation/documentation-publish`, {
			documentationFiles,
			paginationButtons,
			backLink,
			errors: validationErrors || errors
		});
	}

	// else deliver the success page
	// and get the breadcrumbs for the folder that was being viewed before publishing queue
	// 	so we can put the link up on the success page, and they can return there
	const { title: caseName, reference: caseReference } = response.locals.case;
	const backlinkFolderId = getFolderIdFromFolderPath(backLinkFolder);
	const backlinkFolderBreadcrumbItems = await buildBreadcrumbItems(caseId, backlinkFolderId);

	response.render(`applications/case-documentation/documentation-success-banner`, {
		breadcrumbItems: backlinkFolderBreadcrumbItems,
		selectedPageType: 'documentation-publish-success',
		serviceName: 'Document/s successfully published',
		successMessage: `${tryPublish.items?.length} documents published to the NI website<br><br><p class="govuk-!-font-size-19">Case: ${caseName}<br>Reference: ${caseReference}</p>`,
		showPublishedBanner: true
	});
}

/**
 * Handle the removal of the documentation from the publishing queue
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {caseId: number, documentGuid: string}>}
 */
export async function removeApplicationsCaseDocumentationPublishingQueue(request, response) {
	const { caseId, documentGuid } = request.params;

	await removeCaseDocumentationPublishingQueue(caseId, documentGuid);

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
	// clear session folder back link
	destroySessionFolderPage(request.session);
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

/**
 * Gets the id of the current folder from the folder path
 * eg for /applications-service/case/1/project-documentation/55/responses/
 * it will return 55
 *
 * @param {string} folderPath
 * @returns {number}}
 */
const getFolderIdFromFolderPath = (folderPath) => {
	// folder paths look like this: /applications-service/case/1/project-documentation/55/responses/
	// we want the current folder Id: 55 in this example
	const folderIdString = folderPath.split('/')[5];
	const folderId = Number.parseInt(folderIdString, 10);

	return folderId;
};

/**
 *
 * @param {number} currentPageNumber
 * @param {number} pageCount
 * @returns {any}
 */
const getPaginationButtonData = (currentPageNumber, pageCount) => {
	return {
		...(currentPageNumber === 1 ? {} : { previous: { href: `?number=${currentPageNumber - 1}` } }),
		...(currentPageNumber === pageCount
			? {}
			: { next: { href: `?number=${currentPageNumber + 1}` } }),
		items: [...Array.from({ length: pageCount }).keys()].map((index) => ({
			number: index + 1,
			href: `?number=${index + 1}`,
			current: index + 1 === currentPageNumber
		}))
	};
};
