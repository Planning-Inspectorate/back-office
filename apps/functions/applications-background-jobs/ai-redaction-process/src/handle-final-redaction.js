import { requestWithApiKey } from '../../common/backend-api-request.js';
import config from '../../common/config.js';
import { buildFilenameSuffix } from './build-filename-suffix.js';

export const handleFinalRedaction = async (context, message) => {
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
		context.log(`Final redaction failed for ${documentGuid}`);

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
	const newFilename = buildFilenameSuffix(originalFilename, 'redact');

	// Step 1:  Mark previous version as reviewed
	context.log(`Marking previous version as ai_suggestions_reviewed`);

	await requestWithApiKey.post(metadataUri, {
		json: {
			redactedStatus: 'ai_suggestions_reviewed'
		}
	});

	// Step 2: Create new version (final redacted document)
	const createVersionUri = `https://${config.API_HOST}/applications/${caseId}/document/${documentGuid}/add-version`;

	context.log(`Creating final redacted version: ${newFilename}`);

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

	context.log(`Final redacted version created for ${newFilename}`);

	// Step 3: Update latest version status to 'redacted'
	context.log(`Updating new version status to redacted`);

	await requestWithApiKey.post(metadataUri, {
		json: {
			redactedStatus: 'redacted'
		}
	});

	context.log(`Document ${documentGuid} marked as redacted`);
};
