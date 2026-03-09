import { requestWithApiKey } from '../common/backend-api-request.js';
import config from '../common/config.js';

/**
 * Azure Service Bus subscriber for AI doc redaction process
 *
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, message) => {
	context.log('Received ai doc redaction message');

	try {
		const { stage, status, parameters } = message;
		const metadata = parameters?.metadata;

		if (!metadata) {
			throw new Error('Missing metadata in redaction message');
		}

		const { caseId, documentGuid, folderId, originalFilename, mime, size, documentRef } = metadata;

		if (!caseId || !documentGuid) {
			throw new Error('Missing caseId or documentGuid');
		}

		// currently only care about suggestion stage
		if (stage !== 'ANALYSE') {
			context.log(`Ignoring stage ${stage}`);
			return;
		}

		if (status !== 'SUCCESS') {
			context.log(`Redaction failed for ${documentGuid}`);

			const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents`;

			await requestWithApiKey
				.patch(requestUri, {
					json: [
						{
							guid: documentGuid,
							redactedStatus: 'ai_redaction_failed'
						}
					]
				})
				.json();

			context.log(`Updated document ${documentGuid} to ai_redaction_failed`);

			return;
		}

		const writeDetails = parameters?.writeDetails?.properties;

		if (!writeDetails?.blobPath) {
			throw new Error('Missing writeDetails blobPath');
		}

		const privateBlobPath = `/${writeDetails.blobPath}`;

		const newFilename = buildSuggestionsFilename(originalFilename);

		const requestUri = `https://${config.API_HOST}/applications/${caseId}/document/${documentGuid}/add-version`;

		context.log(`Creating redaction suggestion version for document ${documentGuid}`);

		await requestWithApiKey
			.post(requestUri, {
				json: {
					documentName: newFilename,
					folderId,
					documentType: mime,
					documentSize: size,
					username: 'Redaction tool',
					documentReference: documentRef,
					privateBlobPath
				}
			})
			.json();

		context.log(`Redaction suggestion version successfully created for ${documentGuid}`);

		const updateUri = `https://${config.API_HOST}/applications/${caseId}/documents`;

		await requestWithApiKey.patch(updateUri, {
			json: [
				{
					guid: documentGuid,
					redactedStatus: 'ai_suggestions_review_required'
				}
			]
		});
	} catch (error) {
		context.log.error('Redaction subscriber failed');
		context.log.error(error);
		throw error;
	}
};

/**
 * Adds `_Redaction_Suggestions` before the file extension
 * @param {string} filename
 * @returns {string}
 */
const buildSuggestionsFilename = (filename) => {
	if (!filename) return 'Redaction_Suggestions.pdf';

	const lastDot = filename.lastIndexOf('.');

	if (lastDot === -1) {
		return `${filename}_Redaction_Suggestions`;
	}

	const name = filename.slice(0, lastDot);
	const ext = filename.slice(lastDot);

	// Prevent duplicate suffix if message retries
	if (name.endsWith('_Redaction_Suggestions')) {
		return filename;
	}

	return `${name}_Redaction_Suggestions${ext}`;
};
