import config from '#environment/config.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { initialiseAndMapLPAQData } from '#lib/mappers/lpaQuestionnaire.mapper.js';
import { dayMonthYearToApiDateString, webDateToDisplayDate } from '../../../lib/dates.js';
import {
	mapReasonOptionsToCheckboxItemParameters,
	mapReasonsToReasonsList
} from '#lib/mappers/validation-outcome-reasons.mapper.js';

/**
 * @typedef {import('../../appeals.types.js').DayMonthYear} DayMonthYear
 * @typedef {import("../../../lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 * @typedef {import('./lpa-questionnaire.types.js').LPAQuestionnaireValidationOutcome} LPAQuestionnaireValidationOutcome
 * @typedef {import('../appeal-details.types.js').NotValidReasonOption} NotValidReasonOption
 * @typedef {import('../appeal-details.types.js').BodyValidationOutcome} BodyValidationOutcome
 * @typedef {import('./lpa-questionnaire.types.js').LPAQuestionnaireSessionValidationOutcome} SessionValidationOutcome
 */

export const backLink = (/** @type {import("../appeal-details.types.js").Appeal} */ appeal) => {
	return {
		text: 'Back to case details',
		link: `/appeals-service/appeal-details/${appeal.appealId}`
	};
};
export const pageHeading = 'LPA Questionnaire';

/**
 * @param {{ lpaQ: import("../appeal-details.types.js").SingleLPAQuestionnaireResponse; }} lpaData
 * @param {{ appeal: import("../appeal-details.types.js").Appeal}} appealData
 * @param {string} currentRoute
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 */
export async function lpaQuestionnairePage(lpaData, appealData, currentRoute, session) {
	const mappedLPAQData = initialiseAndMapLPAQData(lpaData, currentRoute);
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

	const reviewOutcome = mappedLPAQData.lpaQ.reviewOutcome.input?.filter(
		(/** @type {{ type: string; }} */ inputOption) => inputOption.type === 'radio'
	);

	return [caseSummary, pageSections, reviewOutcome].flat();
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
			mappedLPAQData.lpaQ?.isCorrectAppealType?.display.summaryListItem,
			mappedLPAQData.lpaQ?.doesAffectAListedBuilding?.display.summaryListItem,
			mappedLPAQData.lpaQ?.affectsListedBuildingDetails?.display.summaryListItem,
			mappedLPAQData.lpaQ?.inCAOrrelatesToCA?.display.summaryListItem,
			mappedLPAQData.lpaQ?.conservationAreaMap?.display.summaryListItem,
			mappedLPAQData.lpaQ?.siteWithinGreenBelt?.display.summaryListItem
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
			mappedLPAQData.lpaQ?.notifyingParties?.display.summaryListItem,
			mappedLPAQData.lpaQ?.lpaNotificationMethods?.display.summaryListItem,
			mappedLPAQData.lpaQ?.siteNotices?.display.summaryListItem,
			mappedLPAQData.lpaQ?.lettersToNeighbours?.display.summaryListItem,
			mappedLPAQData.lpaQ?.pressAdvert?.display.summaryListItem
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
			mappedLPAQData.lpaQ?.hasRepresentationsFromOtherParties?.display.summaryListItem,
			mappedLPAQData.lpaQ?.representations?.display.summaryListItem
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
		rows: [mappedLPAQData.lpaQ?.officersReport?.display.summaryListItem]
	};

	const neighbouringSitesSummaryLists = [];
	if (mappedLPAQData.lpaQ.neighbouringSite && mappedLPAQData.lpaQ.neighbouringSite.length > 0) {
		for (const site of mappedLPAQData.lpaQ.neighbouringSite) {
			neighbouringSitesSummaryLists.push(site.display.summaryListItem);
		}
	}

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
			mappedLPAQData.lpaQ?.siteAccess?.display.summaryListItem,
			mappedLPAQData.lpaQ?.isAffectingNeighbouringSites?.display.summaryListItem,
			neighbouringSitesSummaryLists,
			mappedLPAQData.lpaQ?.lpaHealthAndSafety?.display.summaryListItem
		].flat()
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
			mappedLPAQData.lpaQ?.otherAppeals?.display.summaryListItem,
			mappedLPAQData.lpaQ?.newConditions?.display.summaryListItem
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
