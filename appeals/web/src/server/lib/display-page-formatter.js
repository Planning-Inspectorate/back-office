import logger from '#lib/logger.js';
import { buildHtmSpan } from '#lib/nunjucks-template-builders/tag-builders.js';
import { appealShortReference } from './nunjucks-filters/appeals.js';
import { mapDocumentInfoVirusCheckStatus } from '#appeals/appeal-documents/appeal-documents.mapper.js';
import { numberToAccessibleDigitLabel } from '#lib/accessibility.js';
import { apiDateStringToDayMonthYear, dateIsInThePast } from '#lib/dates.js';

/**
 * @typedef {import('@pins/appeals.api').Schema.Folder} Folder
 * @typedef {import('@pins/appeals.api').Schema.Document} Document
 * @typedef {import('@pins/appeals.api').Appeals.DocumentInfo} DocumentInfo
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
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
			formattedLinks += `<li><a href='/appeals-service/appeal-details/${
				listOfAppeals[i].appealId
			}' class="govuk-link" aria-label="Appeal ${numberToAccessibleDigitLabel(
				shortAppealReference || ''
			)}">${shortAppealReference}</a></li>`;
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
				formattedLinks += `<li><a href='https://historicengland.org.uk/listing/the-list/list-entry/${
					listedBuildingNumber.listEntry
				}' class="govuk-link" aria-label="Listed building number ${numberToAccessibleDigitLabel(
					listedBuildingNumber.listEntry || ''
				)}">${listedBuildingNumber.listEntry}</a></li>`;
			} else {
				formattedLinks += `<li><a href='https://historicengland.org.uk' class='govuk-link'>ListEntryNumber not yet in BD</a></li>`;
			}
		}
		return `<ul class="govuk-list">${formattedLinks}</ul>`;
	}
	return '<span>No listed building details</span>';
};

/**
 * @param {number} appealId
 * @param {DocumentInfo[]} listOfDocuments
 * @param {boolean} [addLateEntryStatusTag]
 * @returns {HtmlProperty & ClassesProperty}
 */
export const formatDocumentValues = (appealId, listOfDocuments, addLateEntryStatusTag = false) => {
	/** @type {HtmlProperty} */
	const htmlProperty = {
		html: '',
		pageComponents: []
	};

	if (listOfDocuments.length > 0) {
		for (let i = 0; i < listOfDocuments.length; i++) {
			const document = listOfDocuments[i];
			const virusCheckStatus = mapDocumentInfoVirusCheckStatus(document);

			/** @type {PageComponent[]} */
			const documentPageComponents = [];

			if (virusCheckStatus.safe) {
				documentPageComponents.push({
					type: 'html',
					parameters: {
						html: `<a href='/documents/${appealId}/download/${document.id}/preview' target="'_blank'" class="govuk-link">${document.name}</a>`
					}
				});
			} else {
				documentPageComponents.push({
					type: 'html',
					wrapperHtml: {
						opening: '<span>',
						closing: ''
					},
					parameters: {
						html: '',
						pageComponents: [
							{
								type: 'html',
								parameters: {
									html: `<div class="govuk-body govuk-!-margin-bottom-2">${document.name}</div>`
								}
							}
						]
					}
				});
				documentPageComponents.push({
					type: 'html',
					wrapperHtml: {
						opening: '',
						closing: '</span>'
					},
					parameters: {
						html: '',
						pageComponents: [
							{
								type: 'status-tag',
								parameters: {
									status: virusCheckStatus.statusText || ''
								}
							}
						]
					}
				});
			}

			if (addLateEntryStatusTag) {
				documentPageComponents.push({
					type: 'status-tag',
					parameters: {
						status: 'late_entry'
					}
				});
			}

			htmlProperty.pageComponents.push({
				wrapperHtml: {
					opening: '<li>',
					closing: '</li>'
				},
				type: 'html',
				parameters: {
					html: '',
					pageComponents: documentPageComponents
				}
			});
		}

		if (htmlProperty.pageComponents.length > 0) {
			htmlProperty.wrapperHtml = {
				opening: '<ul class="govuk-list">',
				closing: '</ul>'
			};
		}
	} else {
		logger.error('Document not in correct format');
	}

	return htmlProperty;
};

/**
 * @param {number} appealId
 * @param {Folder|undefined} folder
 * @returns {HtmlProperty & ClassesProperty}
 */
export const formatFolderValues = (appealId, folder) => {
	const mappedDocumentInfo =
		folder?.documents?.map((document) => {
			const documentInfo = {
				id: document.id,
				name: document.name,
				// @ts-ignore - id property not present on import('@pins/appeals.api').Schema.Folder but present in data returned from document-folders endpoint...
				folderId: folder.id,
				caseId: appealId,
				virusCheckStatus: document.latestDocumentVersion.virusCheckStatus,
				isLateEntry: document.latestDocumentVersion.isLateEntry
			};

			return documentInfo;
		}) || [];

	const result = formatDocumentValues(appealId, mappedDocumentInfo);

	return result;
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
 * @param {string|null|undefined} [dueDate]
 * @returns {string}
 */
export function mapDocumentStatus(status, dueDate) {
	switch (status?.toLowerCase()) {
		case 'received':
			return 'Received';
		case 'not_received':
			return 'Not received';
		case 'invalid':
			return 'Invalid';
		case 'incomplete':
			if (dueDate) {
				const parsedDueDate = apiDateStringToDayMonthYear(dueDate);
				if (
					parsedDueDate &&
					parsedDueDate.year &&
					parsedDueDate.month &&
					parsedDueDate.day &&
					dateIsInThePast(parsedDueDate.year, parsedDueDate.month, parsedDueDate.day)
				) {
					return 'Overdue';
				}
			}
			return 'Incomplete';
		case 'valid':
			return 'Valid';
		case 'complete':
			return 'Complete';
		default:
			return '';
	}
}
