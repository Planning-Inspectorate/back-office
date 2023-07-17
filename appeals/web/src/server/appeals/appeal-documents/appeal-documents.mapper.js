/**
 * @typedef {import('./appeal-documents.types.js').FolderInfo} FolderInfo
 * @typedef {import('./appeal-documents.types.js').DocumentInfo} DocumentInfo
 */

/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 */
export const mapDocumentsForDisplay = (caseId, folder) => {
	const { documents } = folder;
	if (documents?.length) {
		const document = documents[0];
		return {
			value: document.name,
			actionText: 'Change',
			actionLink: mapDocumentUploadUrl(caseId, folder, document),
			valueType: 'link',
			attributes: {
				href: mapDocumentDownloadUrl(document),
				target: '_docpreview'
			}
		};
	}
	return {
		value: '',
		actionText: 'Add',
		actionLink: mapDocumentUploadUrl(caseId, folder),
		valueType: 'link'
	};
};

/**
 * @param {DocumentInfo} doc
 */
const mapDocumentDownloadUrl = (doc) => {
	return `/documents/${doc.caseId}/download/${doc.id}/preview/`;
};

/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 * @param {DocumentInfo | null} doc
 */
const mapDocumentUploadUrl = (caseId, folder, doc = null) => {
	if (doc) {
		return `/appeals-service/appeal-details/${doc.caseId}/documents/${doc.folderId}/upload/${doc.id}/`;
	}

	return `/appeals-service/appeal-details/${caseId}/documents/${folder.folderId}/upload/`;
};
