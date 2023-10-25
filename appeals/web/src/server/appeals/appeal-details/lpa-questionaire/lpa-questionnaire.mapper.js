import config from '#environment/config.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { initialiseAndMapLPAQData } from '#lib/mappers/lpaQuestionnaire.mapper.js';
import { dayMonthYearToApiDateString, webDateToDisplayDate } from '../../../lib/dates.js';
import {
	mapReasonOptionsToCheckboxItemParameters,
	mapReasonsToReasonsList
} from '#lib/mappers/validation-outcome-reasons.mapper.js';
import { buildNotificationBanners } from '#lib/mappers/notification-banners.mapper.js';
import { buildHtmUnorderedList } from '#lib/nunjucks-template-builders/tag-builders.js';

/**
 * @typedef {import('../../appeals.types.js').DayMonthYear} DayMonthYear
 * @typedef {import("../../../lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 * @typedef {import('./lpa-questionnaire.types.js').LPAQuestionnaireValidationOutcome} LPAQuestionnaireValidationOutcome
 * @typedef {import('../appeal-details.types.js').NotValidReasonResponse} NotValidReasonResponse
 * @typedef {import('../appeal-details.types.js').NotValidReasonOption} NotValidReasonOption
 * @typedef {import('../appeal-details.types.js').BodyValidationOutcome} BodyValidationOutcome
 * @typedef {import('./lpa-questionnaire.types.js').LPAQuestionnaireSessionValidationOutcome} SessionValidationOutcome
 */

export const backLink = (/** @type {import("../appeal-details.types.js").Appeal} */ appeal) => {
	return {
		text: 'Back',
		link: `/appeals-service/appeal-details/${appeal.appealId}`
	};
};
export const pageHeading = 'LPA questionnaire';

/**
 * @typedef {Object} LPAQData
 * @property {import("../appeal-details.types.js").SingleLPAQuestionnaireResponse} lpaq
 */

/**
 * @param {LPAQData} lpaqData
 * @param {{ appeal: import("../appeal-details.types.js").Appeal}} appealData
 * @param {string} currentRoute
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 */
export async function lpaQuestionnairePage(lpaqData, appealData, currentRoute, session) {
	const mappedLPAQData = await initialiseAndMapLPAQData(lpaqData, currentRoute);
	const mappedAppealData = await initialiseAndMapAppealData(appealData, currentRoute, session);
	const appealType = appealData.appeal.appealType;

	const caseSummary = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		classes: 'govuk-summary-list--no-border',
		rows: [
			removeActions(mappedAppealData.appeal.siteAddress.display.summaryListItem),
			removeActions(mappedAppealData.appeal.localPlanningAuthority.display.summaryListItem)
		]
	};

	/**
	 * @type {{ type: string; noActions: boolean; card: { title: { text: string; }; }; rows: (SummaryListRowProperties | undefined)[]; }[]}
	 */
	let pageSections = [];

	switch (appealType) {
		case 'Householder':
			pageSections = householderLpaQuestionnairePage(mappedLPAQData, session);
			break;
		default:
			break;
	}

	const reviewOutcome = mappedLPAQData.lpaq.reviewOutcome.input?.filter(
		(/** @type {{ type: string; }} */ inputOption) => inputOption.type === 'radio'
	);

	const notificationBanners = mapNotificationBannerComponentParameters(
		session,
		lpaqData,
		appealData.appeal.appealId
	);

	return [...notificationBanners, caseSummary, pageSections, reviewOutcome].flat();
}

/**
 *
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {LPAQData} lpaqData
 * @param {number} appealId
 * @returns {import('#lib/mappers/notification-banners.mapper.js').NotificationBannerPageComponent[]}
 */
function mapNotificationBannerComponentParameters(session, lpaqData, appealId) {
	const validationOutcome = lpaqData.lpaq.validation?.outcome?.toLowerCase();

	if (validationOutcome === 'incomplete') {
		if (!('notificationBanners' in session)) {
			session.notificationBanners = {};
		}

		session.notificationBanners.lpaQuestionnaireNotValid = {
			appealId,
			titleText: `LPA Questionnaire is ${String(validationOutcome)}`,
			html: `<ul class="govuk-!-margin-top-0 govuk-!-padding-left-4">${(
				lpaqData.lpaq.validation?.incompleteReasons || []
			)
				.map(
					(reason) =>
						`<li>${reason?.name?.name}${reason?.text?.length ? ':' : ''}</li>${
							reason?.text?.length
								? buildHtmUnorderedList(
										reason?.text,
										0,
										'govuk-!-margin-top-0 govuk-!-padding-left-4'
								  )
								: ''
						}`
				)
				.join('')}</ul>`
		};
	}

	return buildNotificationBanners(session, 'lpaQuestionnaire', appealId);
}

/**
 * @param {SummaryListRowProperties | undefined} row
 * @returns {SummaryListRowProperties | undefined}
 */
function removeActions(row) {
	if (row && row.actions) {
		Reflect.deleteProperty(row, 'actions');
	}
	return row;
}
/**
 *
 * @param {import('#lib/mappers/lpaQuestionnaire.mapper.js').MappedLPAQInstructions} mappedLPAQData
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns
 */
const householderLpaQuestionnairePage = (mappedLPAQData, session) => {
	const sectionOne = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
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
		]
	};

	const sectionTwo = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
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
		]
	};

	const sectionThree = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		card: {
			title: {
				text: '3. Consultation responses and representations'
			}
		},
		rows: [
			mappedLPAQData.lpaq?.hasRepresentationsFromOtherParties?.display.summaryListItem,
			mappedLPAQData.lpaq?.representations?.display.summaryListItem
		]
	};

	const sectionFour = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		card: {
			title: {
				text: '4. Planning officer’s report and supplementary documents'
			}
		},
		rows: [mappedLPAQData.lpaq?.officersReport?.display.summaryListItem]
	};

	const neighbouringSitesSummaryListsKeys = Object.keys(mappedLPAQData.lpaq).filter(
		(key) => key.indexOf('neighbouringSiteAddress') >= 0
	);
	/**
	 * @type {(SummaryListRowProperties | undefined)[]}
	 */
	const neighbouringSitesSummaryLists = [];
	neighbouringSitesSummaryListsKeys.forEach((key) =>
		neighbouringSitesSummaryLists.push(mappedLPAQData.lpaq[key].display.summaryListItem)
	);

	const sectionFive = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
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
		]
	};

	const sectionSix = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		card: {
			title: {
				text: '6. Appeal process'
			}
		},
		rows: [
			mappedLPAQData.lpaq?.otherAppeals?.display.summaryListItem,
			mappedLPAQData.lpaq?.newConditions?.display.summaryListItem
		]
	};

	let allSections = [
		sectionOne,
		sectionTwo,
		sectionThree,
		sectionFour,
		sectionFive,
		sectionSix
	].filter((item) => item !== undefined);

	allSections.forEach((item) => {
		if ('noActions' in item && item.noActions && 'rows' in item) {
			item.rows.forEach((row) => (row ? Reflect.deleteProperty(row, 'actions') : undefined));
		}
	});

	return allSections;
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
 * @param {number} appealId
 * @param {number} lpaQuestionnaireId
 * @param {NotValidReasonOption[]} incompleteReasonOptions
 * @param {LPAQuestionnaireValidationOutcome} validationOutcome
 * @param {string|string[]} [incompleteReasons]
 * @param {Object<string, string[]>} [incompleteReasonsText]
 * @param {DayMonthYear} [updatedDueDate]
 * @returns {SummaryListBuilderParameters}
 */
export function mapReviewOutcomeToSummaryListBuilderParameters(
	appealId,
	lpaQuestionnaireId,
	incompleteReasonOptions,
	validationOutcome,
	incompleteReasons,
	incompleteReasonsText,
	updatedDueDate
) {
	if (validationOutcome === 'incomplete' && !incompleteReasons) {
		throw new Error('validationOutcome incomplete requires incompleteReasons');
	}

	const reasonsList = mapReasonsToReasonsList(
		incompleteReasonOptions,
		incompleteReasons,
		incompleteReasonsText
	);

	/** @type {import('../../../lib/nunjucks-template-builders/summary-list-builder.js').Row[]} */
	const sectionData = [
		{
			title: 'Review outcome',
			value: 'Incomplete',
			valueType: 'text',
			actionText: 'Change',
			actionLink: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}`
		},
		{
			title: 'Incomplete reasons',
			value: reasonsList,
			valueType: 'unorderedList',
			actionText: 'Change',
			actionLink: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete`
		}
	];

	if (updatedDueDate) {
		sectionData.push({
			title: `Updated due date`,
			value: webDateToDisplayDate(updatedDueDate),
			valueType: 'text',
			actionText: 'Change',
			actionLink: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete/date`
		});
	}

	return { rows: sectionData };
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
