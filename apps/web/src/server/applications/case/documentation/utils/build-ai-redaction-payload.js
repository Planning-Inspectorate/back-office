import config from '@pins/applications.web/environment/config.js';

/**
 * @param {import('../../../applications.types').DocumentationFile} document
 * @param {string} caseId
 */
export const buildAiRedactionPayload = (document, caseId) => {
	if (!document.privateBlobPath || !document.privateBlobContainer) {
		throw new Error('Document is missing required blob information for AI redaction.');
	}

	const blobPath = removeLeadingSlash(document.privateBlobPath);

	const destinationPath = buildDestinationBlobPath(blobPath, document);

	return {
		tryApplyProvisionalRedactions: true,
		ruleName: 'default',
		fileKind: 'pdf',
		pinsService: 'CBOS',
		overrideId: `${document.documentGuid}:${document.version}`,
		readDetails: {
			storageKind: 'AzureBlob',
			teamEmail: '',
			properties: {
				blobPath: blobPath,
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
			caseId,
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
 * Replaces document version number with the next document version
 * @param {string} privateBlobPath
 * @param {import('../../../applications.types').DocumentationFile} document
 * @returns {string}
 */
const buildDestinationBlobPath = (privateBlobPath, document) => {
	if (!document.version) {
		throw new Error(
			'Document is missing version number required to build destination blob path for AI redaction.'
		);
	}
	const pathParts = privateBlobPath.split('/');
	const nextVersion = document?.version + 1;
	pathParts[pathParts.length - 1] = nextVersion.toString();

	return pathParts.join('/');
};

/**
 * Removes leading slash from blob path if it exists
 * @param {string} privateBlobPath
 * @returns {string}
 */
const removeLeadingSlash = (privateBlobPath) => {
	if (!privateBlobPath) {
		return privateBlobPath;
	}

	return privateBlobPath.startsWith('/') ? privateBlobPath.slice(1) : privateBlobPath;
};
