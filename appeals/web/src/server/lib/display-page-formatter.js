import logger from '#lib/logger.js';
import { buildHtmSpan } from '#lib/nunjucks-template-builders/tag-builders.js';
import { appealShortReference } from './nunjucks-filters/appeals.js';

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
 * @param {any[] | any} listOfDocuments
 * @returns {string}
 */
export const formatDocumentValues = (appealId, listOfDocuments) => {
	let formattedDocumentList = ``;
	if (
		listOfDocuments !== null &&
		typeof listOfDocuments === 'object' &&
		!Array.isArray(listOfDocuments) &&
		'documents' in listOfDocuments
	) {
		listOfDocuments = listOfDocuments.documents;
		if (Array.isArray(listOfDocuments)) {
			for (let i = 0; i < listOfDocuments.length; i++) {
				const document = listOfDocuments[i];
				formattedDocumentList += `<li><a href='/documents/${appealId}/download/${document.id}/preview' target="'_blank'" class="govuk-link">${document.name}</a></li>`;
			}
			return `<ul class="govuk-list">${formattedDocumentList}</ul>`;
		}
		return `<a href='/documents/${appealId}/download/${listOfDocuments.id}/preview' target="'_blank'" class="govuk-link">${listOfDocuments.name}</a>`;
	} else {
		logger.error('Document not in correct format');
		return '';
	}
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
