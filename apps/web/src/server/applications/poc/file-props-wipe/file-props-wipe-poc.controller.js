import * as pocService from './file-props-wipe-poc.service.js';

const BLOB_FIELDS = ['privateBlobPath', 'privateBlobContainer', 'size', 'mime', 'originalFilename'];

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

/**
 * Builds the metadata-only update payload, explicitly excluding all blob fields.
 * Only includes fields accepted by the POST /documents/:guid/metadata endpoint.
 *
 * @param {Record<string, any>} currentVersion - The current document version record
 * @returns {Record<string, any>} - Payload containing only metadata fields
 */
export function buildMetadataOnlyPayload(currentVersion) {
	// Fields accepted by the metadata endpoint (from document.validators.js schema)
	const ALLOWED_FIELDS = [
		'version',
		'documentType',
		'documentName',
		'fileName',
		'sourceSystem',
		'origin',
		'representative',
		'interestedPartyNumber',
		'description',
		'descriptionWelsh',
		'documentGuid',
		'owner',
		'author',
		'authorWelsh',
		'securityClassification',
		'horizonDataID',
		'fileMD5',
		'path',
		'redactedStatus',
		'publishedStatus',
		'filter1',
		'filter1Welsh',
		'filter2',
		'examinationRefNo'
	];

	/** @type {Record<string, any>} */
	const payload = {};

	for (const key of ALLOWED_FIELDS) {
		if (key in currentVersion && currentVersion[key] !== null && currentVersion[key] !== '') {
			payload[key] = currentVersion[key];
		}
	}

	// Set a test description to trigger the update
	payload.description = payload.description
		? `${payload.description} [POC test update]`
		: '[POC test update]';

	return payload;
}

/**
 * Compares two document version records and returns the fields that differ.
 *
 * @param {Record<string, any>} before - Document version record before update
 * @param {Record<string, any>} after - Document version record after update
 * @param {string[]} fieldsToCompare - List of field names to compare
 * @returns {Array<{ field: string, before: any, after: any }>}
 */
export function compareFields(before, after, fieldsToCompare) {
	const diffs = [];

	for (const field of fieldsToCompare) {
		const beforeVal = before[field] ?? null;
		const afterVal = after[field] ?? null;

		if (beforeVal !== afterVal) {
			diffs.push({ field, before: beforeVal, after: afterVal });
		}
	}

	return diffs;
}

/**
 * GET handler — renders the POC form page.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export async function viewFilePropsWipePoc(request, response) {
	response.render(TEMPLATE_PATH, {});
}

/**
 * POST handler — validates inputs and either shows upload page or redirects to results.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export async function showUploadPage(request, response) {
	const { caseId, folderId, action } = request.body;

	const errors = validateInputs(caseId, folderId);

	if (errors) {
		response.render(TEMPLATE_PATH, { errors });
		return;
	}

	// If user wants to use an existing file in the folder, skip upload
	if (action === 'use-existing') {
		response.redirect(
			`/applications-service/poc/file-props-wipe/results?caseId=${caseId}&folderId=${folderId}`
		);
		return;
	}

	response.render(TEMPLATE_PATH, {
		showUploader: true,
		caseId,
		folderId
	});
}

/**
 * GET handler — runs the metadata update workflow after file upload completes.
 * The fileUploader component redirects here after a successful upload.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export async function runFilePropsWipePoc(request, response) {
	const { caseId, folderId } = request.query;

	if (!caseId || !folderId) {
		response.render(TEMPLATE_PATH, {
			apiError: { step: 'params', message: 'Missing caseId or folderId query parameters' }
		});
		return;
	}

	const caseIdStr = String(caseId);
	const folderIdStr = String(folderId);

	// 1. Fetch the most recently uploaded document from the folder
	/** @type {any} */
	let folderDocuments;

	try {
		folderDocuments = await pocService.getFolderDocuments(caseIdStr, folderIdStr);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
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
			apiError: { step: 'fetch-folder', message: 'No documents found in folder after upload' }
		});
		return;
	}

	// 2. Fetch pre-update state
	/** @type {Record<string, any>} */
	let beforeState;

	try {
		beforeState = /** @type {Record<string, any>} */ (
			await pocService.getDocumentProperties(caseIdStr, guidStr)
		);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
			apiError: {
				step: 'fetch-before',
				message: error.message || 'Failed to fetch document properties'
			}
		});
		return;
	}

	// 3. Build metadata-only payload and call update
	const metadataPayload = buildMetadataOnlyPayload(beforeState);

	try {
		await pocService.updateDocumentProperties(caseIdStr, guidStr, metadataPayload);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
			apiError: { step: 'update', message: error.message || 'Failed to update document properties' }
		});
		return;
	}

	// 4. Fetch post-update state
	/** @type {Record<string, any>} */
	let afterState;

	try {
		afterState = /** @type {Record<string, any>} */ (
			await pocService.getDocumentProperties(caseIdStr, guidStr)
		);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
			apiError: {
				step: 'fetch-after',
				message: error.message || 'Failed to fetch document properties after update'
			}
		});
		return;
	}

	// 5. Compare blob fields
	const diffs = compareFields(beforeState, afterState, BLOB_FIELDS);
	const bugReproduced = diffs.length > 0;

	// 6. Render results
	response.render(TEMPLATE_PATH, {
		results: {
			documentGuid: guidStr,
			version: beforeState.version,
			beforeState,
			afterState,
			diffs,
			bugReproduced
		}
	});
}

/**
 * POST handler — deletes the most recent document in the folder and redirects back to upload.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export async function deleteAndRetry(request, response) {
	const { caseId, folderId } = request.body;

	if (!caseId || !folderId) {
		response.render(TEMPLATE_PATH, {
			apiError: { step: 'delete', message: 'Missing caseId or folderId' }
		});
		return;
	}

	// Fetch the most recent document in the folder
	/** @type {any} */
	let folderDocuments;

	try {
		folderDocuments = await pocService.getFolderDocuments(caseId, folderId);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
			apiError: { step: 'delete', message: error.message || 'Failed to fetch folder documents' }
		});
		return;
	}

	const latestDoc = folderDocuments?.items?.[0];
	const guidStr = latestDoc?.documentGuid;

	if (!guidStr) {
		// No document to delete — redirect to upload
		response.render(TEMPLATE_PATH, {
			showUploader: true,
			caseId,
			folderId
		});
		return;
	}

	// Delete the document
	try {
		await pocService.deleteDocument(caseId, guidStr);
	} catch (/** @type {any} */ error) {
		response.render(TEMPLATE_PATH, {
			apiError: { step: 'delete', message: error.message || 'Failed to delete document' }
		});
		return;
	}

	// Show the upload page again
	response.render(TEMPLATE_PATH, {
		showUploader: true,
		caseId,
		folderId
	});
}
