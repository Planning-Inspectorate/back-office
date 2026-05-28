import * as pocService from './file-props-wipe-poc.service.js';
import logger from '../../../lib/logger.js';

/**
 * Fields that Phase 1 (attemptInsertDocuments) sets via attachMetadataToDocuments,
 * but Phase 2 (upsertDocumentVersionsMetadataToDatabase) wipes because it only
 * sends { privateBlobContainer, documentGuid, privateBlobPath } to the upsert.
 */
const METADATA_FIELDS_SET_IN_PHASE1 = [
	'documentType',
	'filter1',
	'filter1Welsh',
	'author',
	'authorWelsh',
	'description',
	'descriptionWelsh',
	'stage',
	'sourceSystem',
	'owner'
];

/**
 * Fields that should survive because they're on the DocumentVersion record
 * from Phase 1's create path (not the update path).
 */
const FIELDS_THAT_SURVIVE = [
	'privateBlobPath',
	'privateBlobContainer',
	'mime',
	'size',
	'originalFilename',
	'fileName'
];

const BASE_URL = '/applications-service/poc/file-props-wipe';
const TEMPLATE_PATH = 'applications/poc/file-props-wipe/file-props-wipe-poc';

/**
 * Validates that caseId and folderId are present and non-empty.
 *
 * @param {string|undefined} caseId
 * @param {string|undefined} folderId
 * @returns {{ caseId?: string, folderId?: string } | null}
 */
export function validateInputs(caseId, folderId) {
	/** @type {Record<string, string>} */
	const errors = {};

	if (!caseId || !caseId.trim()) {
		errors.caseId = 'Case ID is required';
	}
	if (!folderId || !folderId.trim()) {
		errors.folderId = 'Folder ID is required';
	}

	return Object.keys(errors).length > 0 ? errors : null;
}

// ─── PAGE 1: Main form (collect caseId + folderId) ───────────────────────────

/**
 * GET / — renders the main form page.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export async function viewMainPage(request, response) {
	response.render(TEMPLATE_PATH, { page: 'main' });
}

/**
 * POST / — validates inputs and redirects to file-upload.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export async function handleMainForm(request, response) {
	const { caseId, folderId } = request.body;

	const errors = validateInputs(caseId, folderId);

	if (errors) {
		response.render(TEMPLATE_PATH, { page: 'main', errors });
		return;
	}

	response.redirect(`${BASE_URL}/file-upload?caseId=${caseId}&folderId=${folderId}`);
}

// ─── PAGE 2: File upload ─────────────────────────────────────────────────────

/**
 * GET /file-upload — renders the file uploader page.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export async function viewFileUpload(request, response) {
	const { caseId, folderId } = request.query;

	if (!caseId || !folderId) {
		response.redirect(BASE_URL);
		return;
	}

	response.render(TEMPLATE_PATH, {
		page: 'file-upload',
		caseId: String(caseId),
		folderId: String(folderId)
	});
}

/**
 * POST /file-upload — deletes existing file and re-renders uploader.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export async function deleteAndRetry(request, response) {
	const { caseId, folderId } = request.body;

	if (!caseId || !folderId) {
		response.redirect(BASE_URL);
		return;
	}

	/** @type {any} */
	let folderDocuments;

	try {
		folderDocuments = await pocService.getFolderDocuments(caseId, folderId);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
			page: 'file-upload',
			caseId,
			folderId,
			apiError: { step: 'delete', message: error.message || 'Failed to fetch folder documents' }
		});
		return;
	}

	const latestDoc = folderDocuments?.items?.[0];
	const guidStr = latestDoc?.documentGuid;

	if (guidStr) {
		try {
			await pocService.deleteDocument(caseId, guidStr);
		} catch (/** @type {any} */ error) {
			response.render(TEMPLATE_PATH, {
				page: 'file-upload',
				caseId,
				folderId,
				apiError: { step: 'delete', message: error.message || 'Failed to delete document' }
			});
			return;
		}
	}

	response.render(TEMPLATE_PATH, {
		page: 'file-upload',
		caseId,
		folderId
	});
}

// ─── PAGE 3: Result ──────────────────────────────────────────────────────────

/**
 * GET /result — fetches the most recent document in the folder and shows
 * which metadata fields were wiped by Phase 2 of the upload process.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export async function showResult(request, response) {
	const { caseId, folderId } = request.query;

	if (!caseId || !folderId) {
		response.redirect(BASE_URL);
		return;
	}

	const caseIdStr = String(caseId);
	const folderIdStr = String(folderId);

	logger.info(`[POC] Checking Phase 2 wipe for case=${caseIdStr}, folder=${folderIdStr}`);

	// 1. Fetch the most recently uploaded document from the folder
	/** @type {any} */
	let folderDocuments;

	try {
		folderDocuments = await pocService.getFolderDocuments(caseIdStr, folderIdStr);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
			page: 'result',
			apiError: {
				step: 'fetch-folder',
				message: error.message || 'Failed to fetch folder documents'
			}
		});
		return;
	}

	const latestDoc = folderDocuments?.items?.[0];
	const guidStr = latestDoc?.documentGuid;

	if (!guidStr) {
		response.render(TEMPLATE_PATH, {
			page: 'result',
			apiError: {
				step: 'fetch-folder',
				message: 'No documents found in folder. Upload a file first.'
			}
		});
		return;
	}

	// 2. Fetch the document properties (after both Phase 1 and Phase 2 have completed)
	/** @type {Record<string, any>} */
	let docProperties;

	try {
		docProperties = /** @type {Record<string, any>} */ (
			await pocService.getDocumentProperties(caseIdStr, guidStr)
		);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
			page: 'result',
			apiError: {
				step: 'fetch-properties',
				message: error.message || 'Failed to fetch document properties'
			}
		});
		return;
	}

	logger.info(`[POC] Document properties: ${JSON.stringify(docProperties)}`);

	// 3. Check which metadata fields are null (wiped by Phase 2)
	const wipedFields = METADATA_FIELDS_SET_IN_PHASE1.filter(
		(field) => docProperties[field] === null || docProperties[field] === undefined
	);

	const survivedFields = FIELDS_THAT_SURVIVE.filter(
		(field) => docProperties[field] !== null && docProperties[field] !== undefined
	);

	const bugReproduced = wipedFields.length > 0;

	logger.info(`[POC] Bug reproduced: ${bugReproduced}. Wiped fields: ${wipedFields.join(', ')}`);

	response.render(TEMPLATE_PATH, {
		page: 'result',
		results: {
			documentGuid: guidStr,
			version: docProperties.version,
			docProperties,
			wipedFields,
			survivedFields,
			metadataFields: METADATA_FIELDS_SET_IN_PHASE1,
			blobFields: FIELDS_THAT_SURVIVE,
			bugReproduced
		}
	});
}
