import config from '#environment/config.js';
import { inputInstructionIsRadiosInputInstruction } from '#lib/mappers/global-mapper-formatter.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { initialiseAndMapLPAQData } from '#lib/mappers/lpaQuestionnaire.mapper.js';
import { dayMonthYearToApiDateString, webDateToDisplayDate } from '../../../lib/dates.js';
import {
	mapReasonOptionsToCheckboxItemParameters,
	mapReasonsToReasonsListHtml
} from '#lib/mappers/validation-outcome-reasons.mapper.js';
import { buildNotificationBanners } from '#lib/mappers/notification-banners.mapper.js';
import { buildHtmUnorderedList } from '#lib/nunjucks-template-builders/tag-builders.js';
import { isDefined } from '#lib/ts-utilities.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';

/**
 * @typedef {import('#appeals/appeal-details/appeal-details.types.js').SingleLPAQuestionnaireResponse} LPAQuestionnaire
 * @typedef {import('#appeals/appeal-details/appeal-details.types.js').WebAppeal} Appeal
 * @typedef {import('../../appeals.types.js').DayMonthYear} DayMonthYear
 * @typedef {import('./lpa-questionnaire.types.js').LPAQuestionnaireValidationOutcome} LPAQuestionnaireValidationOutcome
 * @typedef {import('../appeal-details.types.js').NotValidReasonResponse} NotValidReasonResponse
 * @typedef {import('../appeal-details.types.js').NotValidReasonOption} NotValidReasonOption
 * @typedef {import('../appeal-details.types.js').BodyValidationOutcome} BodyValidationOutcome
 * @typedef {import('./lpa-questionnaire.types.js').LPAQuestionnaireSessionValidationOutcome} SessionValidationOutcome
 */

/**
 * @param {LPAQuestionnaire} lpaqDetails
 * @param {Appeal} appealDetails
 * @param {string} currentRoute
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns {Promise<PageContent>}
 */
export async function lpaQuestionnairePage(lpaqDetails, appealDetails, currentRoute, session) {
	const mappedLpaqDetails = await initialiseAndMapLPAQData(lpaqDetails, currentRoute);
	const mappedAppealDetails = await initialiseAndMapAppealData(
		appealDetails,
		currentRoute,
		session
	);
	const appealType = appealDetails.appealType;

	/**
	 * @type {PageComponent}
	 */
	const caseSummary = {
		type: 'summary-list',
		parameters: {
			classes: 'govuk-summary-list--no-border',
			rows: [
				...(mappedAppealDetails.appeal.siteAddress.display.summaryListItem
					? [mappedAppealDetails.appeal.siteAddress.display.summaryListItem]
					: []),
				...(mappedAppealDetails.appeal.localPlanningAuthority.display.summaryListItem
					? [mappedAppealDetails.appeal.localPlanningAuthority.display.summaryListItem]
					: [])
			]
		}
	};
	caseSummary.parameters.rows = caseSummary.parameters.rows.map(
		(/** @type {SummaryListRowProperties} */ row) => removeActions(row)
	);

	/** @type {PageComponent[]} */
	let appealTypeSpecificPageComponents = [];

	switch (appealType) {
		case 'Householder':
			appealTypeSpecificPageComponents = householderLpaQuestionnairePage(mappedLpaqDetails);
			break;
		default:
			break;
	}

	const reviewOutcomeRadiosInputInstruction =
		mappedLpaqDetails.lpaq.reviewOutcome.input?.instructions.find(
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

	const notificationBanners = mapNotificationBannerComponentParameters(
		session,
		lpaqDetails,
		appealDetails.appealId
	);

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `LPA questionnaire - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'LPA questionnaire',
		pageComponents: [
			...notificationBanners,
			caseSummary,
			...appealTypeSpecificPageComponents,
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
 * @param {number} appealId
 * @param {string} appealReference
 * @param {number} lpaQuestionnaireId
 * @param {string} [currentDueDate]
 * @returns {PageContent}
 */
export function updateDueDatePage(appealId, appealReference, lpaQuestionnaireId, currentDueDate) {
	/** @type {PageContent} */
	const pageContent = {
		title: 'Check answers',
		backLinkUrl: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete`,
		preHeading: `Appeal ${appealShortReference(appealReference)}`,
		heading: 'Update LPA questionnaire due date',
		submitButtonText: 'Save and continue',
		pageComponents: []
	};

	if (currentDueDate) {
		pageContent.pageComponents?.push({
			type: 'inset-text',
			parameters: {
				text: `The current due date for the LPA questionnaire is ${currentDueDate}`
			}
		});
		pageContent.skipButtonUrl = `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/check-your-answers`;
	}

	return pageContent;
}

/**
 * @param {number} appealId
 * @param {string} appealReference
 * @param {number} lpaQuestionnaireId
 * @param {NotValidReasonOption[]} incompleteReasonOptions
 * @param {LPAQuestionnaireValidationOutcome} validationOutcome
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {string|string[]} [incompleteReasons]
 * @param {Object<string, string[]>} [incompleteReasonsText]
 * @param {DayMonthYear} [updatedDueDate]
 * @returns {PageContent}
 */
export function checkAndConfirmPage(
	appealId,
	appealReference,
	lpaQuestionnaireId,
	incompleteReasonOptions,
	validationOutcome,
	session,
	incompleteReasons,
	incompleteReasonsText,
	updatedDueDate
) {
	if (validationOutcome === 'incomplete' && !incompleteReasons) {
		throw new Error('validationOutcome incomplete requires incompleteReasons');
	}

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
						text: 'Incomplete'
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}`
							}
						]
					}
				},
				{
					key: {
						text: 'Incomplete reasons'
					},
					value: {
						html: mapReasonsToReasonsListHtml(
							incompleteReasonOptions,
							incompleteReasons,
							incompleteReasonsText
						)
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete`
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
						href: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete/date`
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
		backLinkUrl: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete/date`,
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
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {LPAQuestionnaire} lpaqData
 * @param {number} appealId
 * @returns {PageComponent[]}
 */
function mapNotificationBannerComponentParameters(session, lpaqData, appealId) {
	const validationOutcome = lpaqData.validation?.outcome?.toLowerCase();

	if (validationOutcome === 'incomplete') {
		if (!('notificationBanners' in session)) {
			session.notificationBanners = {};
		}

		const listClasses = 'govuk-!-margin-top-0';
		const detailsPageComponents = (lpaqData.validation?.incompleteReasons || [])
			.filter((reason) => reason.name.hasText)
			.map((reason) => ({
				type: 'details',
				parameters: {
					summaryText: reason.name?.name,
					html: buildHtmUnorderedList(reason.text || [], 0, listClasses)
				}
			}));

		const reasonsWithoutText = (lpaqData.validation?.incompleteReasons || []).filter(
			(reason) => !reason.name.hasText
		);

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

		session.notificationBanners.lpaQuestionnaireNotValid = {
			appealId,
			titleText: `LPA Questionnaire is ${String(validationOutcome)}`,
			html: '',
			pageComponents: detailsPageComponents
		};
	}

	return buildNotificationBanners(session, 'lpaQuestionnaire', appealId);
}

/**
 *
 * @param {{lpaq: MappedInstructions}} mappedLPAQData
 * @returns {PageComponent[]}
 */
const householderLpaQuestionnairePage = (mappedLPAQData) => {
	/** @type {PageComponent[]} */
	const pageComponents = [];

	pageComponents.push({
		/** @type {'summary-list'} */
		type: 'summary-list',
		parameters: {
			card: {
				title: {
					text: '1. Constraints, designations and other issues'
				}
			},
			rows: [
				mappedLPAQData.lpaq?.isCorrectAppealType?.display.summaryListItem,
				mappedLPAQData.lpaq?.doesAffectAListedBuilding?.display.summaryListItem,
				mappedLPAQData.lpaq?.affectsListedBuildingDetails?.display.summaryListItem,
				mappedLPAQData.lpaq?.inCAOrrelatesToCA?.display.summaryListItem,
				mappedLPAQData.lpaq?.conservationAreaMap?.display.summaryListItem,
				mappedLPAQData.lpaq?.siteWithinGreenBelt?.display.summaryListItem
			].filter(isDefined)
		}
	});

	pageComponents.push({
		/** @type {'summary-list'} */
		type: 'summary-list',
		parameters: {
			card: {
				title: {
					text: '2. Notifying relevant parties of the application'
				}
			},
			rows: [
				mappedLPAQData.lpaq?.notifyingParties?.display.summaryListItem,
				mappedLPAQData.lpaq?.lpaNotificationMethods?.display.summaryListItem,
				mappedLPAQData.lpaq?.siteNotices?.display.summaryListItem,
				mappedLPAQData.lpaq?.lettersToNeighbours?.display.summaryListItem,
				mappedLPAQData.lpaq?.pressAdvert?.display.summaryListItem
			].filter(isDefined)
		}
	});

	pageComponents.push({
		/** @type {'summary-list'} */
		type: 'summary-list',
		parameters: {
			card: {
				title: {
					text: '3. Consultation responses and representations'
				}
			},
			rows: [
				mappedLPAQData.lpaq?.hasRepresentationsFromOtherParties?.display.summaryListItem,
				mappedLPAQData.lpaq?.representations?.display.summaryListItem
			].filter(isDefined)
		}
	});

	pageComponents.push({
		/** @type {'summary-list'} */
		type: 'summary-list',
		parameters: {
			card: {
				title: {
					text: '4. Planning officer’s report and supplementary documents'
				}
			},
			rows: [mappedLPAQData.lpaq?.officersReport?.display.summaryListItem].filter(isDefined)
		}
	});

	/** @type {SummaryListRowProperties[]} */
	const neighbouringSitesSummaryLists = Object.keys(mappedLPAQData.lpaq)
		.filter((key) => key.indexOf('neighbouringSiteAddress') >= 0)
		.map((key) => mappedLPAQData.lpaq[key].display.summaryListItem)
		.filter(isDefined);

	pageComponents.push({
		/** @type {'summary-list'} */
		type: 'summary-list',
		parameters: {
			card: {
				title: {
					text: '5. Site access'
				}
			},
			rows: [
				mappedLPAQData.lpaq?.siteAccess?.display.summaryListItem,
				mappedLPAQData.lpaq?.isAffectingNeighbouringSites?.display.summaryListItem,
				...neighbouringSitesSummaryLists,
				mappedLPAQData.lpaq?.lpaHealthAndSafety?.display.summaryListItem
			].filter(isDefined)
		}
	});

	pageComponents.push({
		/** @type {'summary-list'} */
		type: 'summary-list',
		parameters: {
			card: {
				title: {
					text: '6. Appeal process'
				}
			},
			rows: [
				mappedLPAQData.lpaq?.otherAppeals?.display.summaryListItem,
				mappedLPAQData.lpaq?.newConditions?.display.summaryListItem
			].filter(isDefined)
		}
	});

	return pageComponents;
};

/**
 *
 * @param {NotValidReasonOption[]} reasonOptions
 * @param {BodyValidationOutcome} [bodyValidationOutcome]
 * @param {SessionValidationOutcome} [sessionValidationOutcome]
 * @param {import('./lpa-questionnaire.types.js').LPAQuestionnaireValidationOutcomeResponse|null} [existingValidationOutcome]
 * @returns {import('../../appeals.types.js').CheckboxItemParameter[]}
 */
export function mapIncompleteReasonOptionsToCheckboxItemParameters(
	reasonOptions,
	bodyValidationOutcome,
	sessionValidationOutcome,
	existingValidationOutcome
) {
	/** @type {import('../appeal-details.types.js').NotValidReasonResponse[]} */
	let existingReasons = [];
	/** @type {number[]|undefined} */
	let existingReasonIds;

	if (existingValidationOutcome?.outcome.toLowerCase() === 'incomplete') {
		existingReasons = existingValidationOutcome?.incompleteReasons || [];
		existingReasonIds = existingReasons.map((reason) => reason.name?.id);
	}

	const bodyValidationBaseKey = `incompleteReason`;
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
 * @param {LPAQuestionnaireValidationOutcome} validationOutcome
 * @param {string|string[]} [incompleteReasons]
 * @param {Object<string, string[]>} [incompleteReasonsText]
 * @param {DayMonthYear} [updatedDueDate]
 * @returns {import('./lpa-questionnaire.types.js').LPAQuestionnaireValidationOutcomeRequest}
 */
export function mapWebValidationOutcomeToApiValidationOutcome(
	validationOutcome,
	incompleteReasons,
	incompleteReasonsText,
	updatedDueDate
) {
	/** @type number[] */
	let parsedReasons = [];

	if (incompleteReasons) {
		if (!Array.isArray(incompleteReasons)) {
			incompleteReasons = [incompleteReasons];
		}
		parsedReasons = incompleteReasons.map((reason) => parseInt(reason, 10));
		if (!parsedReasons.every((value) => !Number.isNaN(value))) {
			throw new Error('failed to parse one or more invalid reason IDs to integer');
		}
	}

	return {
		validationOutcome,
		...(validationOutcome === 'incomplete' &&
			incompleteReasons &&
			incompleteReasonsText && {
				incompleteReasons: parsedReasons.map((reason) => ({
					id: reason,
					...(incompleteReasonsText?.[`${reason}`] && {
						text: incompleteReasonsText?.[`${reason}`]
					})
				}))
			}),
		...(updatedDueDate && {
			lpaQuestionnaireDueDate: dayMonthYearToApiDateString(updatedDueDate)
		})
	};
}
