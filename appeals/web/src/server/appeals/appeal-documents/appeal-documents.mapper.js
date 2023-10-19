import { capitalize } from 'lodash-es';
import { dayMonthYearToApiDateString } from '#lib/dates.js';

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
 * @param {function} mapDocumentUploadUrl
 * @param {boolean?} [singleDocument]
 * @returns {MappedFolderForListBuilder}
 */
export const mapFolder = (caseId, folder, mapDocumentUploadUrl, singleDocument = true) => {
	const { documents } = folder;
	const documentMap = (documents || []).map((document) => {
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
 * @typedef {Object} AddDocumentDetailsItemParams
 * @property {string} documentName
 * @property {string} documentId
 */

/**
 * @typedef {Object} AddDocumentDetailsPageParams
 * @property {string} folderName
 * @property {AddDocumentDetailsItemParams[]} detailsItems
 */

/**
 *
 * @param {FolderInfo} folder
 * @param {Object<string, any>} bodyItems
 * @returns {AddDocumentDetailsPageParams}
 */
export const mapFolderToAddDetailsPageParams = (folder, bodyItems) => ({
	folderName: folderPathToFolderNameText(folder.path),
	detailsItems: folder.documents
		.filter((document) => document.latestDocumentVersion?.publishedStatus === 'awaiting_upload')
		.map((document) => ({
			documentName: document.name,
			documentId: document.id,
			...(bodyItems && {
				receivedDate: bodyItems.find(
					(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
				)?.receivedDate,
				redactionStatus: bodyItems.find(
					(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
				)?.redactionStatus
			})
		}))
});

/**
 *
 * @typedef {Object} DocumentDetailsFormItem
 * @property {string} documentId
 * @property {Object<string, string>} receivedDate
 * @property {string} redactionStatus
 */

/**
 *
 * @typedef {Object} DocumentDetailsFormData
 * @property {DocumentDetailsFormItem[]} items
 */

/**
 *
 * @param {DocumentDetailsFormData} formData
 * @param {import('@pins/appeals.api').Schema.DocumentRedactionStatus[]} redactionStatuses
 * @returns {import('./appeal.documents.service.js').DocumentDetailsAPIPatchRequest}
 */
export const mapDocumentDetailsFormDataToAPIRequest = (formData, redactionStatuses) => {
	return {
		documents: formData.items.map((item) => ({
			id: item.documentId,
			receivedDate: dayMonthYearToApiDateString({
				day: parseInt(item.receivedDate.day, 10),
				month: parseInt(item.receivedDate.month, 10),
				year: parseInt(item.receivedDate.year, 10)
			}),
			redactionStatus: mapRedactionStatusNameToId(redactionStatuses, item.redactionStatus)
		}))
	};
};

/**
 * @param {import('@pins/appeals.api').Schema.DocumentRedactionStatus[]} redactionStatuses
 * @param {string} redactionStatusName
 * @returns {number}
 */
const mapRedactionStatusNameToId = (redactionStatuses, redactionStatusName) => {
	for (const status of redactionStatuses) {
		if (status.name.toLowerCase() === redactionStatusName.toLowerCase()) {
			return status.id;
		}
	}
	return 0;
};

/**
 *
 * @param {string} folderPath
 * @returns {string}
 */
const folderPathToFolderNameText = (folderPath) => {
	return capitalize(
		(folderPath.split('/')?.[1] || '').replace(/(?<!^)([A-Z])/g, ' $1').toLowerCase()
	);
};
