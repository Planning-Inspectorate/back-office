import { requestWithApiKey } from '../../common/backend-api-request.js';
import config from '../../common/config.js';
import { buildFilenameSuffix } from './build-filename-suffix.js';

export const handleSuggestions = async (context, message) => {
	const { status, parameters } = message;
	const metadata = parameters?.metadata;

	if (!metadata) {
		throw new Error('Missing metadata in redaction message');
	}

	const { caseId, documentGuid, folderId, originalFilename, mime, size, documentRef } = metadata;

	if (!caseId || !documentGuid) {
		throw new Error('Missing caseId or documentGuid');
	}

	const metadataUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentGuid}/metadata`;

	if (status !== 'SUCCESS') {
		context.log(`Redaction failed for ${documentGuid}`);

		await requestWithApiKey.post(metadataUri, {
			json: {
				redactedStatus: 'ai_redaction_failed'
			}
		});

		context.log(`Updated document ${documentGuid} to ai_redaction_failed`);
		return;
	}

	const writeDetails = parameters?.writeDetails?.properties;

	if (!writeDetails?.blobPath) {
		throw new Error('Missing writeDetails blobPath');
	}

	const privateBlobPath = `/${writeDetails.blobPath}`;
	const newFilename = buildFilenameSuffix(originalFilename);

	// Step 1: reset version 1 status before creating new version
	context.log(`Resetting previous version status for ${originalFilename}`);

	await requestWithApiKey.post(metadataUri, {
		json: {
			redactedStatus: 'not_redacted'
		}
	});

	// Step 2: create new version for redaction suggestion
	const createVersionUri = `https://${config.API_HOST}/applications/${caseId}/document/${documentGuid}/add-version`;

	context.log(`Creating redaction suggestion version for ${newFilename}`);

	await requestWithApiKey.post(createVersionUri, {
		json: {
			documentName: newFilename,
			folderId,
			documentType: mime,
			documentSize: size,
			username: 'Redaction tool',
			documentReference: documentRef,
			privateBlobPath
		}
	});

	context.log(`Redaction suggestion version successfully created for ${newFilename}`);

	// Step 3: update new version status to 'ai_suggestions_review_required'
	context.log(`Updating suggestion version status for ${newFilename}`);

	await requestWithApiKey.post(metadataUri, {
		json: {
			redactedStatus: 'ai_suggestions_review_required'
		}
	});
};
