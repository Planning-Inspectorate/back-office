/**
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
 * @typedef {import('@pins/appeals.api').Appeals.DocumentInfo} DocumentInfo
 */

/**
 * @typedef {Object} MappedFolderForListBuilder
 * @property {string} addDocumentUrl
 * @property {MappedDocumentForListBuilder[]} documents
 */

/**
 * @typedef {Object} MappedDocumentForListBuilder
 * @property {string} title
 * @property {string} href
 * @property {string} addVersionUrl
 */

/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 * @param {boolean?} [singleDocument]
 * @returns {MappedFolderForListBuilder}
 */
export const mapFolder = (caseId, folder, singleDocument = true) => {
	const { documents } = folder;
	const documentMap = documents.map((document) => {
		return {
			title: document.name,
			href: mapDocumentDownloadUrl(document),
			addVersionUrl: mapDocumentUploadUrl(caseId, folder, document)
		};
	});

	return {
		addDocumentUrl: mapDocumentUploadUrl(caseId, folder),
		documents: singleDocument ? (documentMap.length ? [documentMap[0]] : []) : documentMap
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
