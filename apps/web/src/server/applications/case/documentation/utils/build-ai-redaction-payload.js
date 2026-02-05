import config from '@pins/applications.web/environment/config.js';

/**
 * @param {import('../../../applications.types').DocumentationFile} document
 */
export const buildAiRedactionPayload = (document) => {
	if (!document.privateBlobPath || !document.privateBlobContainer) {
		throw new Error('Document is missing required blob information for AI redaction.');
	}

	const destinationPath = buildDestinationBlobPath(document.privateBlobPath);

	return {
		tryApplyProvisionalRedactions: true,
		skipRedaction: true, // TODO: Remove this flag when ready to apply redactions
		ruleName: 'default',
		fileKind: 'pdf',
		pinsService: 'cbos',
		readDetails: {
			storageKind: 'AzureBlob',
			teamEmail: '',
			properties: {
				blobPath: document.privateBlobPath,
				containerName: document.privateBlobContainer,
				storageName: config.azureAiDocRedactionBlobStorageName
			}
		},
		writeDetails: {
			storageKind: 'AzureBlob',
			teamEmail: '',
			properties: {
				blobPath: destinationPath,
				containerName: document.privateBlobContainer,
				storageName: config.azureAiDocRedactionBlobStorageName
			}
		},
		metadata: {
			documentGuid: document.documentGuid,
			version: document.version,
			caseRef: document.caseRef,
			documentRef: document.documentRef,
			folderId: document.folderId,
			fileName: document.fileName,
			originalFilename: document.originalFilename,
			mime: document.mime,
			size: document.size,
			description: document.description,
			descriptionWelsh: document.descriptionWelsh,
			author: document.author,
			authorWelsh: document.authorWelsh,
			owner: document.owner,
			representative: document.representative,
			interestedPartyNumber: document.interestedPartyNumber,
			stage: document.stage,
			documentType: document.documentType,
			filter1: document.filter1,
			filterWelsh: document.filter1Welsh,
			examinationRefNo: document.examinationRefNo
		}
	};
};

/**
 * Replaces document version number with timestamp of ai redaction
 * @param {string} privateBlobPath
 * @returns {string}
 */
const buildDestinationBlobPath = (privateBlobPath) => {
	const pathParts = privateBlobPath.split('/');
	pathParts[pathParts.length - 1] = new Date().getTime().toString();

	return pathParts.join('/');
};
