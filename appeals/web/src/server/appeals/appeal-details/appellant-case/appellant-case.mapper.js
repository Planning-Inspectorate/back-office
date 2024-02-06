import config from '#environment/config.js';
import { inputInstructionIsRadiosInputInstruction } from '#lib/mappers/global-mapper-formatter.js';
import { dayMonthYearToApiDateString, webDateToDisplayDate } from '#lib/dates.js';
import { capitalize } from 'lodash-es';
import {
	mapReasonOptionsToCheckboxItemParameters,
	mapReasonsToReasonsListHtml
} from '#lib/mappers/validation-outcome-reasons.mapper.js';
import { buildNotificationBanners } from '#lib/mappers/notification-banners.mapper.js';
import { buildHtmUnorderedList } from '#lib/nunjucks-template-builders/tag-builders.js';
import {
	initialiseAndMapData,
	documentUploadUrlTemplate,
	mapDocumentManageUrl
} from '#lib/mappers/appellantCase.mapper.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';
import * as displayPageFormatter from '#lib/display-page-formatter.js';
import { isFolderInfo } from '#lib/ts-utilities.js';
import { addDraftDocumentsNotificationBanner } from '#lib/mappers/documents.mapper.js';

/**
 * @typedef {import('../../appeals.types.js').DayMonthYear} DayMonthYear
 * @typedef {import('@pins/appeals.api').Appeals.NotValidReasonOption} NotValidReasonOption
 * @typedef {import('@pins/appeals.api').Appeals.IncompleteInvalidReasonsResponse} IncompleteInvalidReasonsResponse
 * @typedef {import('../appeal-details.types.js').BodyValidationOutcome} BodyValidationOutcome
 * @typedef {import('@pins/appeals.api').Appeals.SingleAppellantCaseResponse} SingleAppellantCaseResponse
 * @typedef {import('./appellant-case.types.js').AppellantCaseValidationOutcome} AppellantCaseValidationOutcome
 * @typedef {import('./appellant-case.types.js').AppellantCaseSessionValidationOutcome} AppellantCaseSessionValidationOutcome
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
 * @typedef {import('@pins/appeals.api').Appeals.DocumentInfo} DocumentInfo
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 */

/**
 *
 * @param {SingleAppellantCaseResponse} appellantCaseData
 * @param {Appeal} appealDetails
 * @param {string} currentRoute
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {import('got').Got} apiClient
 * @returns {Promise<PageContent>}
 */
export async function appellantCasePage(
	appellantCaseData,
	appealDetails,
	currentRoute,
	session,
	apiClient
) {
	const mappedAppellantCaseData = initialiseAndMapData(appellantCaseData, currentRoute);

	/**
	 * @type {PageComponent}
	 */
	const appellantCaseSummary = {
		type: 'summary-list',
		parameters: {
			classes: 'govuk-summary-list--no-border',
			rows: [
				...(mappedAppellantCaseData.siteAddress.display.summaryListItem
					? [mappedAppellantCaseData.siteAddress.display.summaryListItem]
					: []),
				...(mappedAppellantCaseData.localPlanningAuthority.display.summaryListItem
					? [mappedAppellantCaseData.localPlanningAuthority.display.summaryListItem]
					: [])
			]
		}
	};

	appellantCaseSummary.parameters.rows = appellantCaseSummary.parameters.rows.map(
		(/** @type {SummaryListRowProperties} */ row) => removeActions(row)
	);

	/**
	 * @type {PageComponent}
	 */
	const appellantSummary = {
		type: 'summary-list',
		parameters: {
			card: {
				title: {
					text: '1. Appellant'
				}
			},
			rows: [
				mappedAppellantCaseData.appellantName.display.summaryListItem,
				mappedAppellantCaseData.applicantName.display.summaryListItem,
				mappedAppellantCaseData.applicationReference.display.summaryListItem
			]
		}
	};

	/**
	 * @type {PageComponent}
	 */
	const appealSiteSummary = {
		type: 'summary-list',
		parameters: {
			card: {
				title: {
					text: '2. Appeal site'
				}
			},
			rows: [
				mappedAppellantCaseData.siteAddress.display.summaryListItem,
				mappedAppellantCaseData.siteFullyOwned.display.summaryListItem,
				mappedAppellantCaseData.sitePartiallyOwned.display.summaryListItem,
				mappedAppellantCaseData.allOwnersKnown.display.summaryListItem,
				mappedAppellantCaseData.attemptedToIdentifyOwners.display.summaryListItem,
				mappedAppellantCaseData.advertisedAppeal.display.summaryListItem,
				mappedAppellantCaseData.visibility.display.summaryListItem,
				mappedAppellantCaseData.healthAndSafetyIssues.display.summaryListItem
			]
		}
	};

	/**
	 * @type {PageComponent}
	 */
	const appealSummary = {
		type: 'summary-list',
		parameters: {
			attributes: {
				id: 'appeal-summary'
			},
			card: {
				title: {
					text: '3. Appeal status'
				}
			},
			rows: [
				mappedAppellantCaseData.applicationForm.display.summaryListItem,
				mappedAppellantCaseData.decisionLetter.display.summaryListItem,
				mappedAppellantCaseData.appealStatement.display.summaryListItem,
				mappedAppellantCaseData.addNewSupportingDocuments.display.summaryListItem,
				mappedAppellantCaseData.newSupportingDocuments.display.summaryListItem
			]
		}
	};

	/**
	 * @type {PageComponent}
	 */
	const additionalDocumentsSummary = {
		type: 'summary-list',
		parameters: {
			classes: 'pins-summary-list--fullwidth-value',
			card: {
				title: {
					text: 'Additional documents'
				},
				actions: {
					items:
						isFolderInfo(appellantCaseData.documents.additionalDocuments) &&
						appellantCaseData.documents.additionalDocuments.documents.length > 0
							? [
									{
										text: 'Manage',
										visuallyHiddenText: 'additional documents',
										href: mapDocumentManageUrl(
											appellantCaseData.appealId,
											appellantCaseData.documents.additionalDocuments.folderId
										)
									},
									{
										text: 'Add',
										visuallyHiddenText: 'additional documents',
										href: displayPageFormatter.formatDocumentActionLink(
											appellantCaseData.appealId,
											appellantCaseData.documents.additionalDocuments,
											documentUploadUrlTemplate
										)
									}
							  ]
							: [
									{
										text: 'Add',
										visuallyHiddenText: 'additional documents',
										href: displayPageFormatter.formatDocumentActionLink(
											appellantCaseData.appealId,
											appellantCaseData.documents.additionalDocuments,
											documentUploadUrlTemplate
										)
									}
							  ]
				}
			},
			rows: mappedAppellantCaseData.additionalDocuments.display.summaryListItems
		}
	};

	const reviewOutcomeRadiosInputInstruction =
		mappedAppellantCaseData.reviewOutcome.input?.instructions.find(
			inputInstructionIsRadiosInputInstruction
		);

	/** @type {PageComponent[]} */
	const reviewOutcomeComponents = [];

	if (reviewOutcomeRadiosInputInstruction) {
		reviewOutcomeComponents.push({
			type: 'radios',
			parameters: reviewOutcomeRadiosInputInstruction.properties
		});
	}

	if (getDocumentsForVirusStatus(appellantCaseData, 'not_checked').length > 0) {
		addNotificationBannerToSession(session, 'notCheckedDocument', appealDetails?.appealId);
	}

	await addDraftDocumentsNotificationBanner(
		appealDetails?.appealId,
		appellantCaseData.documents,
		session,
		apiClient,
		`/appeals-service/appeal-details/${appealDetails?.appealId}/appellant-case/add-document-details/{{folderId}}`
	);

	/** @type {PageComponent[]} */
	const errorSummaryPageComponents = [];

	if (getDocumentsForVirusStatus(appellantCaseData, 'failed_virus_check').length > 0) {
		errorSummaryPageComponents.push({
			type: 'error-summary',
			parameters: {
				titleText: 'There is a problem',
				errorList: [
					{
						text: 'One or more documents in this appellant case contains a virus. Upload a different version of each document that contains a virus.',
						href: '#appeal-summary'
					}
				]
			}
		});
	}

	const existingValidationOutcome = getValidationOutcomeFromAppellantCase(appellantCaseData);
	const notificationBanners = mapNotificationBannerComponentParameters(
		session,
		existingValidationOutcome,
		existingValidationOutcome === 'invalid'
			? appellantCaseData.validation?.invalidReasons || []
			: appellantCaseData.validation?.incompleteReasons || [],
		appealDetails?.appealId
	);

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Appellant case - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Appellant case',
		pageComponents: [
			...errorSummaryPageComponents,
			...notificationBanners,
			appellantCaseSummary,
			appellantSummary,
			appealSiteSummary,
			appealSummary,
			additionalDocumentsSummary,
			...reviewOutcomeComponents
		]
	};

	if (
		!session.account.idTokenClaims.groups.includes(config.referenceData.appeals.caseOfficerGroupId)
	) {
		pageContent.pageComponents?.forEach((component) => {
			if ('rows' in component.parameters && Array.isArray(component.parameters.rows)) {
				component.parameters.rows = component.parameters.rows.map((row) => removeActions(row));
			}
		});
	}

	if (pageContent.pageComponents) {
		preRenderPageComponents(pageContent.pageComponents);
	}

	return pageContent;
}

/**
 * @param {string|undefined} outcomeString
 * @returns {outcomeString is AppellantCaseValidationOutcome}
 */
export function stringIsAppellantCaseValidationOutcome(outcomeString) {
	return (
		outcomeString !== undefined &&
		(outcomeString === 'valid' || outcomeString === 'invalid' || outcomeString === 'incomplete')
	);
}

/**
 * @param {SingleAppellantCaseResponse} appellantCaseData
 * @returns {AppellantCaseValidationOutcome|undefined}
 */
export function getValidationOutcomeFromAppellantCase(appellantCaseData) {
	const existingValidationOutcomeString = appellantCaseData.validation?.outcome?.toLowerCase();

	return stringIsAppellantCaseValidationOutcome(existingValidationOutcomeString)
		? existingValidationOutcomeString
		: undefined;
}

/**
 * @param {number} appealId
 * @param {string} appealReference
 * @returns {PageContent}
 */
export function updateDueDatePage(appealId, appealReference) {
	/** @type {PageContent} */
	const pageContent = {
		title: 'Check answers',
		backLinkUrl: `/appeals-service/appeal-details/${appealId}/appellant-case/incomplete/`,
		preHeading: `Appeal ${appealShortReference(appealReference)}`,
		heading: 'Update appeal due date',
		submitButtonText: 'Save and continue',
		skipButtonUrl: `/appeals-service/appeal-details/${appealId}/appellant-case/check-your-answers`,
		pageComponents: []
	};

	return pageContent;
}

/**
 *
 * @param {number} appealId
 * @param {string} appealReference
 * @param {NotValidReasonOption[]} reasonOptions
 * @param {AppellantCaseValidationOutcome} validationOutcome
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {Object<string, string[]>} [invalidOrIncompleteReasonsText]
 * @param {DayMonthYear} [updatedDueDate]
 * @returns {PageContent}
 */
export function checkAndConfirmPage(
	appealId,
	appealReference,
	reasonOptions,
	validationOutcome,
	session,
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

	const validationOutcomeAsString = String(validationOutcome);

	/** @type {PageComponent} */
	const summaryListComponent = {
		type: 'summary-list',
		parameters: {
			rows: [
				{
					key: {
						text: 'Review outcome'
					},
					value: {
						text: capitalize(validationOutcomeAsString)
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `/appeals-service/appeal-details/${appealId}/appellant-case`
							}
						]
					}
				},
				{
					key: {
						text: `${capitalize(validationOutcomeAsString)} reasons`
					},
					value: {
						html: mapReasonsToReasonsListHtml(
							reasonOptions,
							invalidOrIncompleteReasons,
							invalidOrIncompleteReasonsText
						)
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcomeAsString.toLowerCase()}`
							}
						]
					}
				}
			]
		}
	};

	if (updatedDueDate) {
		summaryListComponent.parameters.rows.push({
			key: {
				text: 'Updated due date'
			},
			value: {
				text: webDateToDisplayDate(updatedDueDate)
			},
			actions: {
				items: [
					{
						text: 'Change',
						href: `/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcomeAsString.toLowerCase()}/date`
					}
				]
			}
		});
	}

	/** @type {PageComponent} */
	const insetTextComponent = {
		type: 'inset-text',
		parameters: {
			text: 'Confirming this review will inform the appellant and LPA of the outcome'
		}
	};

	/** @type {PageContent} */
	const pageContent = {
		title: 'Check answers',
		backLinkUrl:
			validationOutcome === 'incomplete'
				? `/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcome}/date`
				: `/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcome}`,
		preHeading: `Appeal ${appealShortReference(appealReference)}`,
		heading: 'Check your answers before confirming your review',
		pageComponents: [summaryListComponent, insetTextComponent]
	};

	if (
		!session.account.idTokenClaims.groups.includes(config.referenceData.appeals.caseOfficerGroupId)
	) {
		pageContent.pageComponents?.forEach((component) => {
			if ('rows' in component.parameters && Array.isArray(component.parameters.rows)) {
				component.parameters.rows = component.parameters.rows.map((row) => removeActions(row));
			}
		});
	}

	return pageContent;
}

/**
 *
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {AppellantCaseValidationOutcome|undefined} validationOutcome
 * @param {IncompleteInvalidReasonsResponse[]} notValidReasons
 * @param {number} appealId
 * @returns {PageComponent[]}
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

		const detailsPageComponents = (notValidReasons || [])
			.filter((reason) => reason.name.hasText)
			.map((reason) => ({
				type: 'details',
				parameters: {
					summaryText: reason.name?.name,
					html: buildHtmUnorderedList(reason.text || [], 0, listClasses)
				}
			}));

		const reasonsWithoutText = (notValidReasons || []).filter((reason) => !reason.name.hasText);

		if (reasonsWithoutText.length > 0) {
			detailsPageComponents.unshift({
				type: 'details',
				parameters: {
					summaryText: 'Incorrect name and/or missing documents',
					html: buildHtmUnorderedList(
						reasonsWithoutText.map((reason) => reason.name.name),
						0,
						listClasses
					)
				}
			});
		}

		session.notificationBanners.appellantCaseNotValid = {
			appealId,
			titleText: `Appeal is ${String(validationOutcome)}`,
			html: '',
			pageComponents: detailsPageComponents
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
	/** @type {IncompleteInvalidReasonsResponse[]} */
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
 * @param {SingleAppellantCaseResponse} appellantCaseData
 * @param {"not_checked"|"checked"|"failed_virus_check"} virusStatus
 * @returns {DocumentInfo[]}
 */
function getDocumentsForVirusStatus(appellantCaseData, virusStatus) {
	const unscannedFiles = [];
	for (const folder of Object.values(appellantCaseData.documents)) {
		if ('documents' in folder) {
			const documentsOfStatus = folder.documents.filter(
				(item) => item.virusCheckStatus === virusStatus
			);
			for (const document of documentsOfStatus) {
				unscannedFiles.push(document);
			}
		}
	}
	return unscannedFiles;
}
