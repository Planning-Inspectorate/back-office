import logger from '#lib/logger.js';
import { buildHtmSpan } from '#lib/nunjucks-template-builders/tag-builders.js';
import { appealShortReference } from './nunjucks-filters/appeals.js';

/**
 *
 * @param {any} appealId
 * @param {any} listOfDocuments
 * @returns
 */
export const formatDocumentActionLink = (appealId, listOfDocuments) => {
	if (
		listOfDocuments != null &&
		typeof listOfDocuments === 'object' &&
		'documents' in listOfDocuments
	) {
		if (Array.isArray(listOfDocuments.documents) && listOfDocuments.documents.length > 0) {
			const document = listOfDocuments.documents[0];
			return `/appeals-service/appeal-details/${document.caseId}/documents/${document.folderId}/upload/${document.id}`;
		}
		return `/appeals-service/appeal-details/${appealId}/documents/${listOfDocuments.folderId}/upload/`;
	}
	return `#`;
};

/**
 * @param {string | any[]} notificationMethods
 * @returns {string}
 */
export const formatListOfNotificationMethodsToHtml = (notificationMethods) => {
	let html = ``;
	if (notificationMethods.length > 0) {
		for (const method of notificationMethods) {
			html += `<span>${method.name}</span>`;
			html += notificationMethods.indexOf(method) !== notificationMethods.length - 1 ? `</br>` : ``; //TODO: change this to ul
		}
	}
	return html;
};

/**
 * @param {string} answer
 * @param {string} details
 * @returns {string}
 */
export const formatAnswerAndDetails = (answer, details) => {
	return answer === 'Yes'
		? `${buildHtmSpan(answer)}<br>${buildHtmSpan(details)}`
		: `${buildHtmSpan(answer)}`;
};

/**
 *
 * @param {{appealId: Number, appealReference: string}[]} listOfAppeals
 * @returns {string}
 */
export const formatListOfAppeals = (
	/** @type {{appealId: Number, appealReference: string}[]} */ listOfAppeals
) => {
	if (listOfAppeals.length > 0) {
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
 * @returns
 */
export const formatDocumentValues = (appealId, listOfDocuments) => {
	let formattedDocumentList = ``;
	if (
		listOfDocuments !== null &&
		typeof listOfDocuments === 'object' &&
		'documents' in listOfDocuments
	) {
		listOfDocuments = listOfDocuments.documents;
		if (Array.isArray(listOfDocuments)) {
			for (let i = 0; i < listOfDocuments.length; i++) {
				const document = listOfDocuments[i];
				formattedDocumentList += `<li><a href='/documents/${appealId}/download/${document.id}/preview' target="'_docpreview'" class="govuk-link">${document.name}</a></li>`;
			}
			return `<ul class="govuk-list">${formattedDocumentList}</ul>`;
		}
		return `<a href='/documents/${appealId}/download/${listOfDocuments.id}/preview' target="'_docpreview'" class="govuk-link">${listOfDocuments.name}</a>`;
	} else {
		logger.error('Document not in correct format');
		if (Array.isArray(listOfDocuments)) {
			for (let i = 0; i < listOfDocuments.length; i++) {
				logger.info(listOfDocuments[i]);
				formattedDocumentList += `<li><a href='#' class="govuk-link">${listOfDocuments[i]}</a></li>`;
			}
			return `<ul class="govuk-list">${formattedDocumentList}</ul>`;
		}
		return `<a href='#' class="govuk-link">${listOfDocuments}</a>`;
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
 * @param {string} status
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
