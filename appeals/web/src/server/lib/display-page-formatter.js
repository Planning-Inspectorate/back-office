import logger from '#lib/logger.js';
import { buildHtmSpan } from '#lib/nunjucks-template-builders/tag-builders.js';
import { appealShortReference } from './nunjucks-filters/appeals.js';
import { mapDocumentInfoVirusCheckStatus } from '#appeals/appeal-documents/appeal-documents.mapper.js';

/**
 * @typedef {import('#appeals/appeals.types.js').DocumentInfo} DocumentInfo
 * @typedef {import('#appeals/appeals.types.js').FolderInfo} FolderInfo
 */

/**
 *
 * @param {number} appealId
 * @param {any} listOfDocuments
 * @param {string} documentUploadUrlTemplate
 * @returns
 */
export const formatDocumentActionLink = (appealId, listOfDocuments, documentUploadUrlTemplate) => {
	if (
		listOfDocuments != null &&
		typeof listOfDocuments === 'object' &&
		'documents' in listOfDocuments
	) {
		if (Array.isArray(listOfDocuments.documents) && listOfDocuments.documents.length > 0) {
			const document = listOfDocuments.documents[0];
			return documentUploadUrlTemplate
				.replace('{{appealId}}', document.caseId)
				.replace('{{folderId}}', document.folderId)
				.replace('{{documentId}}', document.id);
		}
		return documentUploadUrlTemplate
			.replace('{{appealId}}', String(appealId))
			.replace('{{folderId}}', listOfDocuments.folderId)
			.replace('/{{documentId}}', '');
	}
	return `#`;
};

/**
 * @param {import('@pins/appeals.api/src/database/schema.js').LPANotificationMethodDetails[] | null | undefined} notificationMethods
 * @returns {string}
 */
export const formatListOfNotificationMethodsToHtml = (notificationMethods) => {
	if (!notificationMethods || !notificationMethods.length) {
		return '';
	}
	return `<ul>${notificationMethods.map((method) => `<li>${method.name}</li>`).join('')}</ul>`;
};

/**
 * @param {string} answer
 * @param {string|null|undefined} details
 * @returns {string}
 */
export const formatAnswerAndDetails = (answer, details) => {
	if (!details) {
		return '';
	}
	return answer === 'Yes'
		? `${buildHtmSpan(answer)}<br>${buildHtmSpan(details)}`
		: `${buildHtmSpan(answer)}`;
};

/**
 *
 * @param {import('@pins/appeals.api').Appeals.LinkedAppeal[]} listOfAppeals
 * @returns {string}
 */
export const formatListOfAppeals = (listOfAppeals) => {
	if (listOfAppeals && listOfAppeals.length > 0) {
		let formattedLinks = ``;
		for (let i = 0; i < listOfAppeals.length; i++) {
			const shortAppealReference = appealShortReference(listOfAppeals[i].appealReference);
			formattedLinks += `<li><a href='/appeals-service/appeal-details/${listOfAppeals[i].appealId}' class="govuk-link">${shortAppealReference}</a></li>`;
		}
		return `<ul class="govuk-list"">${formattedLinks}</ul>`;
	}
	return '<span>No appeals</span>';
};

/**
 * @param {string | any[]} listOfListedBuildingNumbers
 * @returns {string}
 */
export const formatListOfListedBuildingNumbers = (
	/** @type {string | any[]} */ listOfListedBuildingNumbers
) => {
	if (listOfListedBuildingNumbers.length > 0) {
		let formattedLinks = ``;
		for (let i = 0; i < listOfListedBuildingNumbers.length; i++) {
			const listedBuildingNumber = listOfListedBuildingNumbers[i];
			if ('listEntry' in listedBuildingNumber) {
				formattedLinks += `<li><a href='https://historicengland.org.uk/listing/the-list/list-entry/${listedBuildingNumber.listEntry}' class="govuk-link">${listedBuildingNumber.listEntry}</a></li>`;
			} else {
				formattedLinks += `<li><a href='https://historicengland.org.uk' class='govuk-link'>ListEntryNumber not yet in BD</a></li>`;
			}
		}
		return `<ul class="govuk-list">${formattedLinks}</ul>`;
	}
	return '<span>No listed building details</span>';
};

/**
 *
 * @param {number} appealId
 * @param {FolderInfo} listOfDocuments
 * @returns {HtmlProperty & ClassesProperty}
 */
export const formatDocumentValues = (appealId, listOfDocuments) => {
	/** @type {HtmlProperty} */
	const htmlProperty = {
		html: '',
		pageComponentGroups: [
			{
				wrapperHtml: {
					opening: '',
					closing: ''
				},
				pageComponents: []
			}
		]
	};

	if (
		listOfDocuments !== null &&
		typeof listOfDocuments === 'object' &&
		'documents' in listOfDocuments
	) {
		for (let i = 0; i < listOfDocuments.documents.length; i++) {
			const document = listOfDocuments.documents[i];
			const virusCheckStatus = mapDocumentInfoVirusCheckStatus(document);

			if (virusCheckStatus.safe) {
				htmlProperty.pageComponentGroups[0].pageComponents.push({
					type: 'html',
					wrapperHtml: {
						opening: `<li>`,
						closing: '</li>'
					},
					parameters: {
						html: `<a href='/documents/${appealId}/download/${document.id}/preview' target="'_blank'" class="govuk-link">${document.name}</a>`
					}
				});
			} else {
				htmlProperty.pageComponentGroups[0].pageComponents.push({
					type: 'status-tag',
					wrapperHtml: {
						opening: `<li><span class="govuk-body">${document.name}</span> `,
						closing: '</li>'
					},
					parameters: {
						status: virusCheckStatus.statusText || ''
					}
				});
			}
		}

		if (htmlProperty.pageComponentGroups[0].pageComponents.length > 0) {
			htmlProperty.pageComponentGroups[0].wrapperHtml.opening = '<ul class="govuk-list">';
			htmlProperty.pageComponentGroups[0].wrapperHtml.closing = '</ul>';
		}
	} else {
		logger.error('Document not in correct format');
	}

	return htmlProperty;
};

/**
 * @param {any} value
 * @returns {string | undefined}
 */
export function nullToEmptyString(value) {
	if (value !== undefined) {
		return value !== null ? value : '';
	} else {
		return undefined;
	}
}

/**
 * @param {string|undefined} status
 * @returns {string}
 */
export function mapDocumentStatus(status) {
	switch (status?.toLowerCase()) {
		case 'received':
			return 'Received';
		case 'not_received':
			return 'Not received';
		case 'invalid':
			return 'Invalid';
		case 'incomplete':
			return 'Incomplete';
		case 'valid':
			return 'Valid';
		case 'complete':
			return 'Complete';
		default:
			return '';
	}
}
