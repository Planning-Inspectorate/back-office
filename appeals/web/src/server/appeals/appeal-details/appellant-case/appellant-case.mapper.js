import { addressToString } from '#lib/address-formatter.js';
import { convertFromBooleanToYesNo } from '#lib/boolean-formatter.js';
import { dayMonthYearToApiDateString, webDateToDisplayDate } from '#lib/dates.js';
import { capitalize } from 'lodash-es';
import {
	mapReasonOptionsToCheckboxItemParameters,
	mapReasonsToReasonsList
} from '#lib/mappers/validation-outcome-reasons.mapper.js';
import { buildNotificationBanners } from '#lib/mappers/notification-banners.mapper.js';
import nunjucks from 'nunjucks';
import { mapDocumentsForDisplay } from '#appeals/appeal-documents/appeal-documents.mapper.js';
import { buildHtmUnorderedList } from '#lib/nunjucks-template-builders/tag-builders.js';

/**
 * @typedef {import('../../appeals.types.js').DayMonthYear} DayMonthYear
 * @typedef {import('../appeal-details.types.js').NotValidReasonOption} NotValidReasonOption
 * @typedef {import('../appeal-details.types.js').NotValidReasonResponse} NotValidReasonResponse
 * @typedef {import('../appeal-details.types.js').BodyValidationOutcome} BodyValidationOutcome
 * @typedef {import('./appellant-case.types.js').SingleAppellantCaseResponse} AppellantCaseResponse
 * @typedef {import('./appellant-case.types.js').AppellantCaseValidationOutcome} AppellantCaseValidationOutcome
 * @typedef {import('./appellant-case.types.js').AppellantCaseSessionValidationOutcome} AppellantCaseSessionValidationOutcome
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
 * @typedef {import('@pins/appeals.api').Appeals.DocumentInfo} DocumentInfo
 * @typedef {import('../../appeal-documents/appeal-documents.mapper.js').MappedFolderForListBuilder} MappedFolderForListBuilder
 * @typedef {import('../../appeal-documents/appeal-documents.mapper.js').MappedDocumentForListBuilder} MappedDocumentForListBuilder
 * @typedef {import('#lib/nunjucks-template-builders/summary-list-builder.js').HtmlTagType} HtmlTagType
 * @typedef {import("#lib/nunjucks-template-builders/summary-list-builder.js").Row} SummaryListBuilderRowArray
 * @typedef {Object<string, SummaryListBuilderRowArray>} MappedAppellantCaseData
 * @typedef {import("#lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 */

/**
 *
 * @param {AppellantCaseResponse} appellantCaseData
 * @param {import('#app/auth/auth.pipes.js').CurrentPermissionSet} permissions
 * @returns {SummaryListBuilderParameters[]}
 */
export function mapResponseToSummaryListBuilderParameters(appellantCaseData, permissions) {
	const completeList = [];
	const mappedData = mapData(appellantCaseData, permissions);
	completeList.push(appellantDataList(mappedData));
	completeList.push(appealSiteDataList(mappedData));
	completeList.push(appealDataList(mappedData));
	return completeList;
}

/**
 *
 * @param {number} appealId
 * @param {NotValidReasonOption[]} reasonOptions
 * @param {AppellantCaseValidationOutcome} validationOutcome
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {Object<string, string[]>} [invalidOrIncompleteReasonsText]
 * @param {DayMonthYear} [updatedDueDate]
 * @returns {SummaryListBuilderParameters}
 */
export function mapReviewOutcomeToSummaryListBuilderParameters(
	appealId,
	reasonOptions,
	validationOutcome,
	invalidOrIncompleteReasons,
	invalidOrIncompleteReasonsText,
	updatedDueDate
) {
	if (
		(validationOutcome === 'invalid' || validationOutcome === 'incomplete') &&
		!invalidOrIncompleteReasons
	) {
		throw new Error(`validationOutcome "${validationOutcome}" requires invalidOrIncompleteReasons`);
	}

	const reasonsList = mapReasonsToReasonsList(
		reasonOptions,
		invalidOrIncompleteReasons,
		invalidOrIncompleteReasonsText
	);
	const validationOutcomeAsString = String(validationOutcome);

	/** @type {import('../../../lib/nunjucks-template-builders/summary-list-builder.js').Row[]} */
	const sectionData = [
		{
			title: 'Review outcome',
			value: capitalize(validationOutcomeAsString),
			valueType: 'text',
			actions: [
				{
					text: 'Change',
					href: `/appeals-service/appeal-details/${appealId}/appellant-case`
				}
			]
		},
		{
			title: `${capitalize(validationOutcomeAsString)} reasons`,
			value: reasonsList,
			valueType: 'unorderedList',
			actions: [
				{
					text: 'Change',
					href: `/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcomeAsString.toLowerCase()}`
				}
			]
		}
	];

	if (updatedDueDate) {
		sectionData.push({
			title: `Updated due date`,
			value: webDateToDisplayDate(updatedDueDate),
			valueType: 'text',
			actions: [
				{
					text: 'Change',
					href: `/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcomeAsString.toLowerCase()}/date`
				}
			]
		});
	}

	return { rows: sectionData };
}

/**
 *
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {AppellantCaseValidationOutcome} validationOutcome
 * @param {NotValidReasonResponse[]} notValidReasons
 * @param {number} appealId
 * @returns {import('#lib/mappers/notification-banners.mapper.js').NotificationBannerPageComponent[]}
 */
export function mapNotificationBannerComponentParameters(
	session,
	validationOutcome,
	notValidReasons,
	appealId
) {
	if (validationOutcome === 'invalid' || validationOutcome === 'incomplete') {
		if (!Array.isArray(notValidReasons)) {
			notValidReasons = [notValidReasons];
		}

		if (!('notificationBanners' in session)) {
			session.notificationBanners = {};
		}

		const listClasses = 'govuk-!-margin-top-0';
		const renderedDetailsItems = (notValidReasons || [])
			.filter((reason) => reason.name.hasText)
			.map((reason) =>
				nunjucks.render('appeals/components/govuk-details.njk', {
					params: {
						summaryText: reason.name?.name,
						html: buildHtmUnorderedList(reason.text || [], 0, listClasses)
					}
				})
			);

		const reasonsWithoutText = (notValidReasons || []).filter((reason) => !reason.name.hasText);

		if (reasonsWithoutText.length > 0) {
			renderedDetailsItems.unshift(
				nunjucks.render('appeals/components/govuk-details.njk', {
					params: {
						summaryText: 'Incorrect name and/or missing documents',
						html: buildHtmUnorderedList(
							reasonsWithoutText.map((reason) => reason.name.name),
							0,
							listClasses
						)
					}
				})
			);
		}

		session.notificationBanners.appellantCaseNotValid = {
			appealId,
			titleText: `Appeal is ${String(validationOutcome)}`,
			html: renderedDetailsItems.join('')
		};
	}

	return buildNotificationBanners(session, 'appellantCase', appealId);
}

/**
 *
 * @param {AppellantCaseValidationOutcome} validationOutcome
 * @param {NotValidReasonOption[]} reasonOptions
 * @param {BodyValidationOutcome} [bodyValidationOutcome]
 * @param {AppellantCaseSessionValidationOutcome} [sessionValidationOutcome]
 * @param {import('./appellant-case.types.js').AppellantCaseValidationOutcomeResponse} [existingValidationOutcome]
 * @returns {import('../../appeals.types.js').CheckboxItemParameter[]}
 */
export function mapInvalidOrIncompleteReasonOptionsToCheckboxItemParameters(
	validationOutcome,
	reasonOptions,
	bodyValidationOutcome,
	sessionValidationOutcome,
	existingValidationOutcome
) {
	/** @type {NotValidReasonResponse[]} */
	let existingReasons = [];
	/** @type {number[]|undefined} */
	let existingReasonIds;

	if (
		existingValidationOutcome &&
		existingValidationOutcome.outcome.toLowerCase() === validationOutcome
	) {
		existingReasons =
			existingValidationOutcome.outcome.toLowerCase() === 'invalid'
				? existingValidationOutcome.invalidReasons || []
				: existingValidationOutcome.incompleteReasons || [];
		existingReasonIds = existingReasons.map((reason) => reason.name.id);
	}

	const bodyValidationBaseKey = `${validationOutcome}Reason`;
	/** @type {string|string[]|undefined} */
	const bodyValidationOutcomeReasons = bodyValidationOutcome?.[bodyValidationBaseKey];

	let notValidReasonIds =
		bodyValidationOutcomeReasons || sessionValidationOutcome?.reasons || existingReasonIds;

	if (typeof notValidReasonIds !== 'undefined' && !Array.isArray(notValidReasonIds)) {
		notValidReasonIds = [notValidReasonIds];
	}
	const checkedOptions = notValidReasonIds?.map((value) =>
		typeof value === 'string' ? parseInt(value, 10) : value
	);

	return mapReasonOptionsToCheckboxItemParameters(
		reasonOptions,
		checkedOptions,
		existingReasons,
		bodyValidationOutcome,
		bodyValidationBaseKey,
		sessionValidationOutcome
	);
}

/**
 *
 * @param {AppellantCaseValidationOutcome} validationOutcome
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {Object<string, string[]>} [invalidOrIncompleteReasonsText]
 * @param {DayMonthYear} [updatedDueDate]
 * @returns {import('./appellant-case.types.js').AppellantCaseValidationOutcomeRequest}
 */
export function mapWebReviewOutcomeToApiReviewOutcome(
	validationOutcome,
	invalidOrIncompleteReasons,
	invalidOrIncompleteReasonsText,
	updatedDueDate
) {
	let parsedReasons;

	if (invalidOrIncompleteReasons) {
		if (!Array.isArray(invalidOrIncompleteReasons)) {
			invalidOrIncompleteReasons = [invalidOrIncompleteReasons];
		}
		parsedReasons = invalidOrIncompleteReasons.map((reason) => parseInt(reason, 10));
		if (!parsedReasons.every((value) => !Number.isNaN(value))) {
			throw new Error('failed to parse one or more invalid reason IDs to integer');
		}
	}

	return {
		validationOutcome: validationOutcome,
		...(validationOutcome === 'invalid' &&
			invalidOrIncompleteReasons && {
				invalidReasons: parsedReasons?.map((reason) => ({
					id: reason,
					...(invalidOrIncompleteReasonsText &&
						invalidOrIncompleteReasonsText[reason] && {
							text: invalidOrIncompleteReasonsText[reason]
						})
				}))
			}),
		...(validationOutcome === 'incomplete' &&
			invalidOrIncompleteReasons && {
				incompleteReasons: parsedReasons?.map((reason) => ({
					id: reason,
					...(invalidOrIncompleteReasonsText &&
						invalidOrIncompleteReasonsText[reason] && {
							text: invalidOrIncompleteReasonsText[reason]
						})
				}))
			}),
		...(updatedDueDate && {
			appealDueDate: dayMonthYearToApiDateString(updatedDueDate)
		})
	};
}

/**
 *
 * @param {AppellantCaseResponse} appellantCaseData
 * @param {import('#app/auth/auth.pipes.js').CurrentPermissionSet} permissions
 * @returns {MappedAppellantCaseData}
 */
function mapData(appellantCaseData, permissions) {
	/** @type {MappedAppellantCaseData} */
	const mappedData = {};

	mappedData.appellantName = {
		title: 'Name',
		value: appellantCaseData.appellant.name || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.applicantName = {
		title: 'Another individual',
		value:
			appellantCaseData.applicant.firstName && appellantCaseData.applicant.surname
				? `${appellantCaseData.applicant.firstName} ${appellantCaseData.applicant.surname}`
				: appellantCaseData.appellant.name || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.applicationReference = {
		title: 'Application reference',
		value: appellantCaseData.planningApplicationReference,
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.siteAddress = {
		title: 'Site address',
		value: addressToString({
			addressLine1: appellantCaseData.appealSite.addressLine1 || '',
			addressLine2: appellantCaseData.appealSite.addressLine2 || '',
			postCode: appellantCaseData.appealSite.postCode || '',
			town: appellantCaseData.appealSite.town || '',
			county: appellantCaseData.appealSite.county || ''
		}),
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.siteFullyOwned = {
		title: 'Site fully owned',
		value: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.isFullyOwned) || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.sitePartiallyOwned = {
		title: 'Site partially owned',
		value: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.isPartiallyOwned) || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.allOwnersKnown = {
		title: 'All owners known',
		value: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.areAllOwnersKnown) || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.attemptedToIdentifyOwners = {
		title: 'Attempted to identify owners',
		value:
			convertFromBooleanToYesNo(appellantCaseData.siteOwnership.hasAttemptedToIdentifyOwners) || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.advertisedAppeal = {
		title: 'Advertised appeal',
		value: convertFromBooleanToYesNo(appellantCaseData.hasAdvertisedAppeal) || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.visibility = {
		title: 'Visibility',
		value: convertFromBooleanToYesNo(appellantCaseData.visibility.isVisible) || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.healthAndSafetyIssues = {
		title: 'Site health and safety issues',
		value: convertFromBooleanToYesNo(appellantCaseData.healthAndSafety.hasIssues) || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.applicationForm = {
		title: 'Application form known',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.applicationForm,
			mapDocumentUploadUrl,
			mapDocumentManageUrl,
			!permissions.setAppellantCaseData
		)
	};

	mappedData.decisionLetter = {
		title: 'Decision letter',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.decisionLetter,
			mapDocumentUploadUrl,
			mapDocumentManageUrl,
			!permissions.setAppellantCaseData
		)
	};

	mappedData.appealStatement = {
		title: 'Appeal statement',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.appealStatement,
			mapDocumentUploadUrl,
			mapDocumentManageUrl,
			!permissions.setAppellantCaseData
		)
	};

	const hasNewSupportingDocuments =
		appellantCaseData.documents.newSupportingDocuments.documents?.length > 0;

	mappedData.addNewSupportingDocuments = {
		title: 'Add new supporting documents',
		value: convertFromBooleanToYesNo(hasNewSupportingDocuments) || '',
		valueType: 'text',
		actions: [
			{
				text: 'Change',
				href: '#'
			}
		]
	};

	mappedData.newSupportingDocuments = {
		title: 'New supporting documents',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.newSupportingDocuments,
			mapDocumentUploadUrl,
			mapDocumentManageUrl,
			!permissions.setAppellantCaseData,
			false
		)
	};

	if (!permissions.setAppellantCaseData) {
		Object.keys(mappedData).forEach((key) => {
			mappedData[key].actions = [];
		});
	}

	return mappedData;
}

/**
 *
 * @param {MappedAppellantCaseData} mappedData
 * @returns {SummaryListBuilderParameters}
 */
function appellantDataList(mappedData) {
	const header = '1. The appellant';

	const sectionData = [
		mappedData.appellantName,
		mappedData.applicantName,
		mappedData.applicationReference
	];

	return { header: header, rows: sectionData };
}

/**
 *
 * @param {MappedAppellantCaseData} mappedData
 * @returns {SummaryListBuilderParameters}
 */
function appealSiteDataList(mappedData) {
	const header = '2. The appeal site';

	const sectionData = [
		mappedData.siteAddress,
		mappedData.siteFullyOwned,
		mappedData.sitePartiallyOwned,
		mappedData.allOwnersKnown,
		mappedData.attemptedToIdentifyOwners,
		mappedData.advertisedAppeal,
		mappedData.visibility,
		mappedData.healthAndSafetyIssues
	];

	return { header: header, rows: sectionData };
}

/**
 *
 * @param {MappedAppellantCaseData} mappedData
 * @returns {SummaryListBuilderParameters}
 */
function appealDataList(mappedData) {
	const header = '3. The appeal';

	const sectionData = [
		mappedData.applicationForm,
		mappedData.decisionLetter,
		mappedData.appealStatement,
		mappedData.addNewSupportingDocuments,
		mappedData.newSupportingDocuments
	];

	return { header: header, rows: sectionData };
}

/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 * @param {DocumentInfo | null} doc
 * @returns {string}
 */
const mapDocumentUploadUrl = (caseId, folder, doc = null) => {
	if (doc) {
		return `/appeals-service/appeal-details/${doc.caseId}/appellant-case/add-documents/${doc.folderId}/${doc.id}/`;
	}

	return `/appeals-service/appeal-details/${caseId}/appellant-case/add-documents/${folder.folderId}/`;
};

/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 * @returns {string}
 */
const mapDocumentManageUrl = (caseId, folder) => {
	return `/appeals-service/appeal-details/${caseId}/appellant-case/manage-documents/${folder.folderId}/`;
};
