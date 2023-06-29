/**
 *
 * @param {number} caseId
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number}[]} documents
 * @returns {{name: string, caseId: number, folderId: number; documentType: string, documentSize: number}[]}
 */
export const mapDocumentsToSendToDatabase = (caseId, documents) => {
	return documents?.map((document) => {
		return {
			name: document.documentName,
			caseId,
			folderId: document.folderId,
			documentType: document.documentType,
			documentSize: document.documentSize
		};
	});
};

/**
 * @param {import('@pins/api').Schema.Document[]} documents
 * @param {string} caseReference
 * @returns {{caseType: string, caseReference: string, GUID: string, documentName: string, blobStoreUrl: string}[]}
 */
export const mapDocumentsToSendToBlobStorage = (documents, caseReference) => {
	return documents.map((document) => {
		return {
			caseType: 'appeal',
			caseReference,
			GUID: document.guid,
			documentName: document.name,
			blobStoreUrl: `appeal/${mapCaseReferenceForStorageUrl(caseReference)}/${
				document.guid
			}/${mapDocumentNameForStorageUrl(document.name)}`
		};
	});
};

/**
 * @param {string} caseReference
 * @returns string
 */
export const mapCaseReferenceForStorageUrl = (caseReference) => {
	return caseReference.replace(/\//g, '-');
};

/**
 * @param {string} documentName
 * @returns string
 */
export const mapDocumentNameForStorageUrl = (documentName) => {
	if (!documentName.includes('.')) return documentName;
	const parts = documentName.split('.');
	parts.pop();
	return parts.join('.');
};
