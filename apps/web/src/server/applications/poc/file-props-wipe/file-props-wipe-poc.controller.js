import * as pocService from './file-props-wipe-poc.service.js';
import logger from '../../../lib/logger.js';

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
	} else {
		response.render(TEMPLATE_PATH, {
			page: 'file-upload',
			caseId,
			folderId,
			apiError: {
				step: 'delete',
				message:
					'No documents found in folder to delete. The duplicate check may include previously deleted files — try using a different filename.'
			}
		});
		return;
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
 * Infers Phase 1 expected state from the folder metadata and upload payload.
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

	// 1. Fetch the most recently uploaded document
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

	// 2. Fetch document properties (after both Phase 1 and Phase 2)
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

	// 3. Fetch folder info to infer what Phase 1 should have set
	/** @type {any} */
	let folderDetails = null;
	/** @type {any[]} */
	let folderParents = [];

	try {
		folderDetails = await pocService.getFolderDetails(caseIdStr, folderIdStr);
	} catch (/** @type {any} */ e) {
		logger.warn(`[POC] Could not fetch folder details: ${e.message}`);
	}

	try {
		folderParents = /** @type {any[]} */ (
			await pocService.getFolderParents(caseIdStr, folderIdStr)
		);
	} catch (/** @type {any} */ e) {
		logger.warn(`[POC] Could not fetch folder parents: ${e.message}`);
	}

	// 4. Determine folder path and whether it's an "Application Documents" folder
	const folderPath = [
		...(folderParents || []).map((/** @type {any} */ f) => f.displayNameEn),
		folderDetails?.displayNameEn
	].filter(Boolean);

	const folderPathStr = folderPath.join(' > ');
	const isAppDocsFolder = folderPath.some(
		(/** @type {string} */ name) => name === 'Project documentation'
	);

	// 5. Build comparison: Phase 1 expected vs actual (after Phase 2)
	// For fields that survive Phase 2, the actual value IS what Phase 1 set.
	// For fields wiped by Phase 2, we infer what Phase 1 would have set.
	const comparison = [
		{
			field: 'mime',
			label: 'MIME type',
			phase1: docProperties.mime,
			actual: docProperties.mime,
			survivesPhase2: true
		},
		{
			field: 'size',
			label: 'File size',
			phase1: docProperties.size,
			actual: docProperties.size,
			survivesPhase2: true
		},
		{
			field: 'originalFilename',
			label: 'Original filename',
			phase1: docProperties.originalFilename,
			actual: docProperties.originalFilename,
			survivesPhase2: true
		},
		{
			field: 'fileName',
			label: 'File name (no ext)',
			phase1: docProperties.fileName,
			actual: docProperties.fileName,
			survivesPhase2: true
		},
		{
			field: 'sourceSystem',
			label: 'Source system',
			phase1: 'back-office-applications',
			actual: docProperties.sourceSystem,
			survivesPhase2: true
		},
		{
			field: 'owner',
			label: 'Owner',
			phase1: docProperties.owner,
			actual: docProperties.owner,
			survivesPhase2: true
		},
		{
			field: 'stage',
			label: 'Stage',
			phase1: folderDetails?.stage || '(could not resolve)',
			actual: docProperties.stage,
			survivesPhase2: false
		},
		{
			field: 'filter1',
			label: 'Filter 1 (webfilter)',
			phase1: isAppDocsFolder ? `derived from folder "${folderDetails?.displayNameEn}"` : null,
			actual: docProperties.filter1,
			survivesPhase2: false
		},
		{
			field: 'author',
			label: 'Author',
			phase1: isAppDocsFolder ? 'derived from case applicant' : null,
			actual: docProperties.author,
			survivesPhase2: false
		},
		{
			field: 'description',
			label: 'Description',
			phase1: null,
			actual: docProperties.description,
			survivesPhase2: false
		},
		{
			field: 'documentType',
			label: 'Document type',
			phase1: null,
			actual: docProperties.documentType,
			survivesPhase2: false
		},
		{
			field: 'privateBlobPath',
			label: 'Blob path',
			phase1: null,
			actual: docProperties.privateBlobPath,
			survivesPhase2: true,
			setByPhase2: true
		},
		{
			field: 'privateBlobContainer',
			label: 'Blob container',
			phase1: null,
			actual: docProperties.privateBlobContainer,
			survivesPhase2: true,
			setByPhase2: true
		}
	];

	// Mark which fields are wiped (expected to have value from Phase 1 but are null after Phase 2)
	const wipedFields = comparison.filter(
		(f) =>
			!f.survivesPhase2 &&
			f.phase1 &&
			!String(f.phase1).startsWith('(not set') &&
			(f.actual === null || f.actual === undefined || f.actual === '')
	);

	const bugReproduced = wipedFields.length > 0;

	logger.info(
		`[POC] Bug reproduced: ${bugReproduced}. Wiped: ${wipedFields.map((f) => f.field).join(', ')}`
	);

	response.render(TEMPLATE_PATH, {
		page: 'result',
		results: {
			documentGuid: guidStr,
			version: docProperties.version,
			folderPath: folderPathStr,
			isAppDocsFolder,
			comparison,
			wipedFields,
			bugReproduced
		}
	});
}
