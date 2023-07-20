/**
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
 * @typedef {import('@pins/appeals.api').Appeals.DocumentInfo} DocumentInfo
 */

/**
 * @typedef {Object} MappedDocumentForDisplay
 * @property {(string[] | string)} value
 * @property {string} actionText
 * @property {string} actionLink
 * @property {import('../../lib/nunjucks-template-builders/summary-list-builder.js').HtmlTagType} valueType
 * @property {{[key: string]: string} | null} [attributes]
 */

/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 * @returns {MappedDocumentForDisplay}
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
		value: 'none',
		actionText: 'Add',
		actionLink: mapDocumentUploadUrl(caseId, folder),
		valueType: 'text'
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
