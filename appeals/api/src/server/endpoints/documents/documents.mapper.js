/** @typedef {import('@pins/appeals/index.js').FileUploadInfo} FileUploadInfo */
/** @typedef {import('@pins/appeals/index.js').DocumentMetadata} DocumentMetadata */
/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersion} DocumentVersion */

/**
 *
 * @param {number} caseId
 * @param {string} blobStorageContainer,
 * @param {FileUploadInfo[]} documents
 * @returns {DocumentMetadata[]}
 */
export const mapDocumentsForDatabase = (caseId, blobStorageContainer, documents) => {
	return documents?.map((document) => {
		return {
			name: document.documentName,
			caseId,
			folderId: document.folderId,
			documentType: document.documentType,
			documentSize: document.documentSize,
			blobStorageContainer
		};
	});
};

/**
 * @param {(DocumentVersion|null)[]} documents
 * @param {string} caseReference
 * @param {number} versionId
 * @returns {(BlobInfo|null)[]}
 */
export const mapDocumentsForBlobStorage = (documents, caseReference, versionId = 1) => {
	return documents.map((document) => {
		if (document) {
			const fileName = document.fileName || document.documentGuid;
			return {
				caseType: 'appeal',
				caseReference,
				GUID: document.documentGuid,
				documentName: fileName,
				blobStoreUrl: mapBlobPath(document.documentGuid, caseReference, fileName, versionId)
			};
		}

		return null;
	});
};

/**
 * @type {(guid: string, caseReference: string, name: string, versionId: number) => string}
 */
export const mapBlobPath = (guid, caseReference, name, versionId = 1) => {
	return `appeal/${mapCaseReferenceForStorageUrl(
		caseReference
	)}/${guid}/v${versionId}/${mapDocumentNameForStorageUrl(name)}`;
};

/**
 * @type {(caseReference: string) => string}
 */
export const mapCaseReferenceForStorageUrl = (caseReference) => {
	return caseReference.replace(/\//g, '-');
};

/**
 * @type {(documentName: string) => string}
 */
export const mapDocumentNameForStorageUrl = (documentName) => {
	if (!documentName.includes('.')) return documentName;
	const parts = documentName.split('.');
	parts.pop();
	return parts.join('.');
};
