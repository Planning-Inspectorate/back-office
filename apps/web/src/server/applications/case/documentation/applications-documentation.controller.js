import { BO_GENERAL_S51_CASE_REF } from '@pins/applications';
import { sortBy } from 'lodash-es';
import { url } from '../../../lib/nunjucks-filters/url.js';
import {
	getSessionFilesNumberOnList,
	setSessionFilesNumberOnList,
	getSuccessBanner,
	destroySuccessBanner,
	getSessionBanner,
	deleteSessionBanner,
	setSessionBanner
} from '../../common/services/session.service.js';
import { buildBreadcrumbItems } from '../applications-case.locals.js';
import {
	createFolder,
	deleteCaseDocumentationFile,
	getCaseDocumentationFileInfo,
	getCaseDocumentationFilesInFolder,
	getCaseDocumentationFileVersions,
	getCaseDocumentationReadyToPublish,
	getCaseFolder,
	getCaseFolders,
	publishCaseDocumentationFiles,
	removeCaseDocumentationPublishingQueue,
	updateCaseDocumentationFiles,
	unpublishCaseDocumentationFiles,
	getCaseManyDocumentationFilesInfo,
	searchDocuments,
	renameFolder,
	deleteFolder,
	updateDocumentsFolderId
} from './applications-documentation.service.js';
import documentationSessionHandlers from './applications-documentation.session.js';
import { paginationParams } from '../../../lib/pagination-params.js';
import { getPaginationLinks } from '../../common/components/pagination/pagination-links.js';
import { featureFlagClient } from '../../../../common/feature-flags.js';
import { validationResult } from 'express-validator';
import logger from '../../../lib/logger.js';
import utils from './utils/move-documents/utils.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../applications-case.locals.js').ApplicationCaseLocals} ApplicationCaseLocals */
/** @typedef {import('../../applications.types').DocumentationCategory} DocumentationCategory */
/** @typedef {import('../../applications.types').DocumentationFile} DocumentationFile */
/** @typedef {import('../../applications.types').DocumentVersion} DocumentVersion */
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
export async function viewApplicationsCaseDocumentationCategories(_, response) {
	const {
		caseId,
		case: { reference }
	} = response.locals;
	// hide the page when attempting to view general section 51 case documentation categories
	if (reference === BO_GENERAL_S51_CASE_REF) {
		return response.render(`app/404`);
	}
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
	const properties = await documentationFolderData(
		response.locals.caseId,
		response.locals.folderId,
		request.query,
		request.session
	);
	const { session } = request;

	documentationSessionHandlers.deleteMoveDocumentsSession(session);

	const sessionBannerText = getSessionBanner(session);

	/**
	 * @typedef {Object} CaseDocumentationProps
	 */
	response.render(`applications/components/folder/folder`, {
		...properties,
		sessionBannerText,
		activeFolderSlug: request.params.folderName
	});

	deleteSessionBanner(session);
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

	const properties = await documentationFolderData(
		response.locals.caseId,
		response.locals.folderId,
		request.query,
		request.session
	);

	const payload = {
		status,
		...redacted,
		documents: (selectedFilesIds || []).map((guid) => ({ guid }))
	};

	const { errors: itemErrors } = await updateCaseDocumentationFiles(caseId, payload);

	if (validationErrors || itemErrors) {
		/** @type {DocumentationFile[]} */
		const allItems = properties.items.items;
		const failedItems = allItems.map((file) => {
			return {
				...file,
				error: (itemErrors || []).find((item) => item.guid === file.documentGuid)?.msg ?? null
			};
		});

		properties.items.items = failedItems;

		return response.render(`applications/components/folder/folder`, {
			...properties,
			activeFolderSlug: request.params.folderName,
			errors: validationErrors ||
				itemErrors || { msg: 'Something went wrong. Please, try again later.' },
			failedItems
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
export async function viewApplicationsCaseDocumentationVersionUpload(_, response) {
	const { caseId, documentGuid } = response.locals;

	const documentationFile = await getCaseDocumentationFileInfo(caseId, documentGuid);

	response.render(`applications/case-documentation/documentation-version-upload`, {
		documentationFile
	});
}

/**
 * View the unpublishing documentation page
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {selectedFilesIds: Array<string>}, {}, {folderId: string, folderName: string}>}
 */
export async function viewApplicationsCaseDocumentationUnpublishPage(request, response) {
	if (request.errors) {
		const properties = await documentationFolderData(
			response.locals.caseId,
			response.locals.folderId,
			request.query,
			request.session
		);

		return response.render('applications/components/folder/folder', {
			...properties,
			activeFolderSlug: request.params.folderName,
			errors: request.errors
		});
	}

	const documentationFiles = await getCaseManyDocumentationFilesInfo(
		response.locals.caseId,
		request.body.selectedFilesIds
	);

	if (!documentationFiles.every((file) => file.publishedStatus === 'published')) {
		const properties = await documentationFolderData(
			response.locals.caseId,
			response.locals.folderId,
			request.query,
			request.session
		);

		return response.render('applications/components/folder/folder', {
			...properties,
			activeFolderSlug: request.params.folderName,
			errors: 'Your selected documents are not published so you cannot unpublish them.'
		});
	}

	return response.render(`applications/case-documentation/documentation-unpublish`, {
		documentationFiles,
		backLink: url('document-category', {
			caseId: response.locals.caseId,
			documentationCategory: {
				id: parseInt(request.params.folderId),
				displayNameEn: request.params.folderName
			}
		})
	});
}

/**
 * View the unpublishing documentation page for a single document
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {folderId: string, folderName: string, documentGuid: string}>}
 */
export async function viewApplicationsCaseDocumentationUnpublishSinglePage(request, response) {
	const { caseId, documentGuid } = response.locals;

	const file = await getCaseDocumentationFileInfo(caseId, documentGuid);

	return response.render(`applications/case-documentation/documentation-unpublish`, {
		documentationFiles: [file],
		backLink: url('document', {
			caseId,
			folderId: parseInt(request.params.folderId),
			documentGuid: documentGuid,
			step: 'properties'
		})
	});
}

/**
 * View the documentation properties page
 *
 * @type {import('@pins/express').RenderHandler<{documentationFile: DocumentationFile, documentVersions: DocumentVersion[], updateBannerText: string|undefined, showSuccessBanner: boolean|undefined, caseIsWelsh: boolean}, {}>}
 */
export async function viewApplicationsCaseDocumentationProperties({ session }, response) {
	const { caseId, caseIsWelsh, documentGuid } = response.locals;

	const documentationFile = await getCaseDocumentationFileInfo(caseId, documentGuid);
	const documentVersions = await getCaseDocumentationFileVersions(documentGuid);

	const updateBannerText = getSessionBanner(session);
	const showSuccessBanner = !!updateBannerText || getSuccessBanner(session);

	deleteSessionBanner(session);
	destroySuccessBanner(session);

	response.render(`applications/case-documentation/properties/documentation-properties`, {
		documentationFile,
		documentVersions,
		updateBannerText,
		showSuccessBanner,
		caseIsWelsh
	});
}

/**
 * View the documentation pages
 *
 * @type {import('@pins/express').RenderHandler<{documentationFile: DocumentationFile, warningText: string|null}, {}>}
 */
export async function viewApplicationsCaseDocumentationPages({ params }, response) {
	const { action } = params;
	if (!['delete', 'edit', 'publish', 'unpublish', 'upload'].includes(action)) {
		return response.render('apps/500.njk');
	}

	const { caseId, documentGuid } = response.locals;

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
 * @type {import('@pins/express').RenderHandler<{documentationFile?: DocumentationFile, errors?: ValidationErrors} | {serviceName?: string, successMessage?: string}, {}>}
 */
export async function updateApplicationsCaseDocumentationDelete(
	{ errors: validationErrors },
	response
) {
	const { caseId, documentGuid } = response.locals;
	const { title: caseName, reference: caseReference } = response.locals.case;
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
		serviceName: 'Document successfully deleted',
		successMessage: `<p class="govuk-!-font-size-19">Case: ${caseName}<br>Reference: ${caseReference}</p>`
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
	const backLink =
		documentationSessionHandlers.getSessionFolderPage(request.session) ??
		url('document-category', { caseId });
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

	const username = session.account?.name;

	const { errors: apiErrors, documents: publishedItems = null } = validationErrors
		? { errors: validationErrors }
		: await publishCaseDocumentationFiles(caseId, items, username);

	const backLinkFolder = documentationSessionHandlers.getSessionFolderPage(session) ?? '';
	const backLink = backLinkFolder ?? url('document-category', { caseId });

	// re-display publishing queue page, with error messages
	if (validationErrors || apiErrors) {
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
			errors: validationErrors || apiErrors
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
		successMessage: `${publishedItems?.length} documents published to the NI website<br><br><p class="govuk-!-font-size-19">Case: ${caseName}<br>Reference: ${caseReference}</p>`,
		extraMessage: 'The documents will show on the NI website within the hour.',
		showPublishedBanner: true
	});
}

/**
 * Handle the removal of the documentation from the publishing queue
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {documentGuid: string}>}
 */
export async function removeApplicationsCaseDocumentationPublishingQueue(request, response) {
	const { caseId, documentGuid } = response.locals;

	await removeCaseDocumentationPublishingQueue(caseId, documentGuid);

	return response.redirect(url('documents-queue', { caseId }));
}

/**
 * Handle unpublishing multiple documents
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {documentGuids: string[]}, {}, {}>}
 * */
export async function postUnpublishDocuments({ body, session }, response) {
	const { documentGuids } = body;
	const { caseId } = response.locals;

	const { errors } = await unpublishCaseDocumentationFiles(caseId, documentGuids);

	const documentationFiles = await getCaseManyDocumentationFilesInfo(caseId, documentGuids);

	if (errors.length > 0) {
		return response.render(`applications/case-documentation/documentation-unpublish`, {
			documentationFiles,
			errors
		});
	}

	const backLinkFolder = documentationSessionHandlers.getSessionFolderPage(session) ?? '';
	const backlinkFolderId = getFolderIdFromFolderPath(backLinkFolder);
	const backlinkFolderBreadcrumbItems = await buildBreadcrumbItems(caseId, backlinkFolderId);

	return response.render('applications/case-documentation/documentation-success-banner', {
		breadcrumbItems: backlinkFolderBreadcrumbItems,
		serviceName: 'Document/s successfully unpublished',
		selectedPageType: 'documentation-unpublish-success',
		successMessage: `<p class="govuk-!-font-size-19">Case: ${response.locals.case.title}<br>Reference: ${response.locals.case.reference}</p>`,
		extraMessage: 'The document/s will be unpublished from the NI website within the hour.'
	});
}

// Data for controllers

/**
 * Get all the data for the display folder page (used by POST and GET) to retrieve shared template properties
 *
 * @param {number} caseId
 * @param {number} folderId
 * @param {{ number?: string, size?: string }} query
 * @param {SessionWithFilesNumberOnList} session
 * @returns {Promise<CaseDocumentationProps>}
 */
const documentationFolderData = async (caseId, folderId, query = {}, session) => {
	const number = Number(query.number || '1');

	const sizeInSession = getSessionFilesNumberOnList(session);

	/** @type {number | null} */
	const sizeInQuery = (() => {
		if (!query.size) {
			return null;
		}

		const size = Number(query.size);
		if (Number.isNaN(size)) {
			return null;
		}

		return size;
	})();

	const size = sizeInQuery || sizeInSession || 50;

	const folderDetails = await getCaseFolder(caseId, folderId);

	setSessionFilesNumberOnList(session, size);

	// clear session folder back link
	documentationSessionHandlers.destroySessionFolderPage(session);
	documentationSessionHandlers.setSessionFolderPage(
		session,
		url('document-category', {
			caseId,
			documentationCategory: {
				id: folderId,
				displayNameEn: folderDetails.displayNameEn
			}
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

	const pagination = paginationParams(size, number, documentationFiles.pageCount);

	return {
		subFolders,
		items: documentationFiles,
		pagination,
		isCustomFolder: folderDetails.isCustom
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

/**
 * Search for documents in a case.
 *
 *  @type {import('@pins/express').RenderHandler<{}, {}, {query: string}, {q: string, page: string}>}
 */
export async function viewApplicationsCaseDocumentationSearchPage(
	{ body, query: requestQuery },
	response
) {
	const { caseId } = response.locals;
	const query = body.query ?? requestQuery.q;
	const pageNumber = Number.parseInt(requestQuery.page || '1', 10);

	const { errors, searchResult } = await searchDocuments(caseId, query, pageNumber);

	const pagination = getPaginationLinks(
		pageNumber,
		searchResult?.pageCount || 0,
		{ q: query },
		url('documents-search', { caseId })
	);

	return response.render('applications/case-documentation/search/document-search-results', {
		searchResult,
		query,
		pagination,
		errors
	});
}

/**
 * @type {import('@pins/express').RenderHandler<*>}
 */
export async function viewFolderCreationPage(request, response) {
	const { caseId } = response.locals;
	const backLink =
		documentationSessionHandlers.getSessionFolderPage(request.session) ??
		url('document-category', { caseId });
	return response.render('applications/components/folder/folder-create', {
		backLink
	});
}

/**
 * @type {import('@pins/express').RenderHandler<*>}
 */
export async function viewFolderRenamePage(request, response) {
	const { caseId } = response.locals;
	const backLink =
		documentationSessionHandlers.getSessionFolderPage(request.session) ??
		url('document-category', { caseId });

	const folder = await getCaseFolder(caseId, parseInt(request.params.folderId));
	const currentName = folder?.displayNameEn;

	return response.render('applications/components/folder/folder-rename', {
		backLink,
		currentName
	});
}

/**
 * @type {import('@pins/express').RenderHandler<*>}
 */
export async function viewFolderDeletionPage(request, response) {
	const { caseId } = response.locals;
	const { folderId } = request.params;

	const folderObject = await getCaseFolder(caseId, parseInt(folderId));
	const backLink =
		documentationSessionHandlers.getSessionFolderPage(request.session) ??
		url('document-category', { caseId });

	return response.render('applications/components/folder/folder-delete', {
		backLink,
		folderName: folderObject.displayNameEn
	});
}

/**
 * @type {import('@pins/express').RenderHandler<*, *, {folderName: string}>}
 */
export async function updateFolderCreate(request, response) {
	if (!featureFlagClient.isFeatureActive('applic-625-custom-folders')) {
		return response.redirect('./');
	}

	const validationError = validationResult(request);
	if (!validationError.isEmpty()) {
		const { caseId } = response.locals;
		const backLink =
			documentationSessionHandlers.getSessionFolderPage(request.session) ??
			url('document-category', { caseId });

		return response.render(`applications/components/folder/folder-create`, {
			backLink,
			errors: validationError.array({ onlyFirstError: true })
		});
	}

	const { session } = request;
	const { folderId } = request.params;
	const { folderName } = request.body;
	const { caseId } = response.locals;

	const { errors } = await createFolder(caseId, folderName, parseInt(folderId));
	if (errors) {
		const backLink =
			documentationSessionHandlers.getSessionFolderPage(request.session) ??
			url('document-category', { caseId });
		return response.render('applications/components/folder/folder-create', {
			backLink,
			errors: [errors] || [{ msg: 'Something went wrong. Please, try again later.' }]
		});
	}

	setSessionBanner(session, 'Folder created');
	return response.redirect('../folder');
}

/**
 * @type {import('@pins/express').RenderHandler<*, *, {folderName: string}>}
 */
export async function updateFolderRename(request, response) {
	async function returnToRenameForm() {
		const { caseId } = response.locals;
		const backLink =
			documentationSessionHandlers.getSessionFolderPage(request.session) ??
			url('document-category', { caseId });

		const folder = await getCaseFolder(caseId, parseInt(request.params.folderId));
		const currentName = folder?.displayNameEn;

		return response.render('applications/components/folder/folder-rename', {
			backLink,
			currentName,
			errors: validationError.array({ onlyFirstError: true })
		});
	}

	const validationError = validationResult(request);
	if (!validationError.isEmpty()) {
		return await returnToRenameForm();
	}

	const { session } = request;
	const { folderId } = request.params;
	const { folderName } = request.body;
	const { caseId } = response.locals;

	const { errors } = await renameFolder(caseId, parseInt(folderId), folderName);
	if (errors) {
		return await returnToRenameForm();
	}

	setSessionBanner(session, 'Folder renamed');
	return response.redirect('../folder');
}

/**
 * @type {import('@pins/express').RenderHandler<*>}
 */
export async function updateFolderDelete(request, response) {
	const { folderId } = request.params;
	const { caseId } = response.locals;

	const currentFolderObject = await getCaseFolder(caseId, parseInt(folderId));
	if (!currentFolderObject.parentFolderId) {
		logger.error(
			'No parentFolderId found - illegal action of deleting root folder, stopping deletion'
		);
		const backLink =
			documentationSessionHandlers.getSessionFolderPage(request.session) ??
			url('document-category', { caseId });
		return response.render('applications/components/folder/folder-delete', {
			backLink,
			errors: [{ msg: 'Folder has no parent. You cannot delete root folders' }]
		});
	}
	const parentFolderForRedirect = await getCaseFolder(caseId, currentFolderObject.parentFolderId);

	const { errors } = await deleteFolder(caseId, parseInt(folderId));
	if (errors) {
		const backLink =
			documentationSessionHandlers.getSessionFolderPage(request.session) ??
			url('document-category', { caseId });
		return response.render('applications/components/folder/folder-delete', {
			backLink,
			errors: [errors] || [{ msg: 'Something went wrong. Please, try again later.' }]
		});
	}

	response.redirect(
		url('document-category', {
			caseId,
			documentationCategory: {
				id: parentFolderForRedirect.id,
				displayNameEn: parentFolderForRedirect.displayNameEn
			}
		})
	);
}

/**
 * View the move documents page
 * @type {import('@pins/express').RenderHandler<{}, {}, {selectedFilesIds: Array<string>}, {}, {folderId: string, folderName: string}>}
 */
export async function viewAndPostApplicationsCaseDocumentationMove(request, response) {
	const { caseId } = response.locals;
	const { body, errors: validationErrors, session, params, query } = request;
	const { folderId } = params;
	const { selectedFilesIds } = body;

	documentationSessionHandlers.startMoveDocumentsSession(session);

	if (validationErrors) {
		const properties = await documentationFolderData(caseId, Number(folderId), query, session);
		return response.render('applications/components/folder/folder', {
			...properties,
			activeFolderSlug: request.params.folderName,
			errors: validationErrors
		});
	}

	let documentationFilesToMove = [];

	if (documentationSessionHandlers.getSessionMoveDocumentsFilesToMove(session).length) {
		documentationFilesToMove =
			documentationSessionHandlers.getSessionMoveDocumentsFilesToMove(session);
	} else {
		const getCaseDocumentationFileInfoPromises = selectedFilesIds.map((documentGuid) =>
			getCaseDocumentationFileInfo(caseId, documentGuid)
		);
		documentationFilesToMove = await Promise.all(getCaseDocumentationFileInfoPromises);

		documentationSessionHandlers.setSessionMoveDocumentsFilesToMove(
			session,
			documentationFilesToMove
		);
	}

	response.render('applications/case-documentation/move-documents/document-list', {
		documentationFilesToMove,
		activeFolderSlug: request.params.folderName,
		backLink: url('document-category', {
			caseId: caseId,
			documentationCategory: {
				id: parseInt(params.folderId),
				displayNameEn: params.folderName
			}
		})
	});
}

/**
 * View the folder explorer page that allows drilling into subfolders
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {parentFolderName: string, parentFolderId: string}>}
 */
export async function viewDocumentationFolderExplorer(request, response) {
	const { caseId } = response.locals;
	const { session, params } = request;

	const folderList = documentationSessionHandlers.getSessionMoveDocumentsFolderList(session);
	const breadcrumbItems = documentationSessionHandlers.getSessionMoveDocumentsBreadcrumbs(session);
	const isRootFolder = documentationSessionHandlers.getSessionMoveDocumentsIsFolderRoot(session);
	const backLink = utils.getBackLinkUrlFromBreadcrumbs(
		breadcrumbItems,
		caseId,
		Number(params.folderId),
		params.folderName
	);

	if (isRootFolder)
		documentationSessionHandlers.setSessionMoveDocumentsRootFolderList(session, folderList);

	return response.render('applications/case-documentation/move-documents/folder-explorer', {
		backLink,
		breadcrumbItems,
		folderListViewData: utils.getFolderViewData(folderList),
		isRootFolder
	});
}

/**
 * Post folder explorer page that allows drilling into subfolders
 * @type {import('@pins/express').RenderHandler<{}, {}, {action: string, openFolder: string}, {}>}
 */
export async function postDocumentationFolderExplorer(request, response) {
	const { caseId, serviceUrl } = response.locals;
	const { body, session, params } = request;
	let validationErrors = request.errors;

	const openFolderId = Number(body.openFolder);
	const folderList = await documentationSessionHandlers.getSessionMoveDocumentsFolderList(session);
	const folderListViewData = utils.getFolderViewData(folderList);
	const parentFolderName = utils.getFolderNameById(folderList, openFolderId);
	const breadcrumbItems = documentationSessionHandlers.getSessionMoveDocumentsBreadcrumbs(session);

	if (body.action === 'moveDocuments') {
		const destinationFolder =
			documentationSessionHandlers.getSessionMoveDocumentsParentFolder(session);
		const payload = utils.getMoveDocumentsPayload(session);

		const { errors: updateErrors } = await updateDocumentsFolderId(caseId, payload);

		if (updateErrors) {
			validationErrors = updateErrors;
		} else {
			setSessionBanner(
				session,
				`Selected documents moved to the ${destinationFolder?.displayNameEn} folder`
			);

			return response.redirect(
				`${serviceUrl}/case/${caseId}/project-documentation/${params.folderId}/${params.folderName}`
			);
		}
	}

	if (validationErrors) {
		return response.render(`applications/case-documentation/move-documents/folder-explorer`, {
			backLink: utils.getBackLinkUrlFromBreadcrumbs(
				breadcrumbItems,
				caseId,
				Number(params.folderId),
				params.folderName
			),
			breadcrumbItems,
			errors: validationErrors,
			folderListViewData,
			isRootFolder: documentationSessionHandlers.getSessionMoveDocumentsIsFolderRoot(session)
		});
	}

	const parentFolder = folderList.find(
		(/** @type {{id: Number}} */ folder) => folder.id === openFolderId
	);
	documentationSessionHandlers.setSessionMoveDocumentsParentFolder(session, parentFolder);

	return response.redirect(
		`./folder-explorer?parentFolderId=${openFolderId}&parentFolderName=${parentFolderName}`
	);
}
