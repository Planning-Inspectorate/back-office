import config from '#environment/config.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { initialiseAndMapLPAQData } from '#lib/mappers/lpaQuestionnaire.mapper.js';
import { dayMonthYearToApiDateString, webDateToDisplayDate } from '../../../lib/dates.js';

/**
 * @typedef {import("../../../lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 * @typedef {import('@pins/appeals.api').Schema.LPAQuestionnaireIncompleteReason} LPAQuestionnaireIncompleteReason
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
 * @param {LPAQuestionnaireIncompleteReason[]} incompleteReasonOptions
 * @param {string|string[]} [incompleteReasons]
 * @param {string} [otherIncompleteReasons]
 * @returns {string[]}
 */
function mapIncompleteReasonsToReasonsList(
	incompleteReasonOptions,
	incompleteReasons,
	otherIncompleteReasons
) {
	const reasons = Array.isArray(incompleteReasons) ? incompleteReasons : [incompleteReasons];

	return (
		reasons
			?.map((reason) =>
				incompleteReasonOptions.find((option) => option.id === parseInt(reason || '', 10))
			)
			.map((option) => {
				if (!option) {
					throw new Error('invalid or incomplete reason ID was not recognised');
				}
				const name = option.name;
				return name.toLowerCase() === 'other' ? `${name}: ${otherIncompleteReasons || ''}` : name;
			}) || ['']
	);
}

/**
 *
 * @param {LPAQuestionnaireIncompleteReason[]} incompleteReasonOptions
 * @param {string[]|number[]} [checkedOptionValues]
 * @returns {import('../../appeals.types.js').CheckboxItemParameter[]}
 */
export function mapIncompleteReasonsToCheckboxItemParameters(
	incompleteReasonOptions,
	checkedOptionValues
) {
	if (checkedOptionValues && !Array.isArray(checkedOptionValues)) {
		checkedOptionValues = [checkedOptionValues];
	}

	let checkedOptions = checkedOptionValues?.map((value) =>
		typeof value === 'string' ? parseInt(value, 10) : value
	);

	return incompleteReasonOptions.map((reason) => ({
		value: `${reason.id}`,
		text: reason.name,
		...(checkedOptions && {
			checked: checkedOptions.includes(reason.id)
		})
	}));
}

/**
 *
 * @param {LPAQuestionnaireIncompleteReason[]} incompleteReasonOptions
 * @param {keyof import('../../appeal.constants.js').lpaQuestionnaireOutcomes} validationOutcome
 * @param {string|string[]} [incompleteReasons]
 * @param {string} [otherIncompleteReasons]
 * @param {import('./lpa-questionnaire.service.js').DayMonthYear} [updatedDueDate]
 * @returns {SummaryListBuilderParameters}
 */
export function mapReviewOutcomeToSummaryListBuilderParameters(
	incompleteReasonOptions,
	validationOutcome,
	incompleteReasons,
	otherIncompleteReasons,
	updatedDueDate
) {
	if (validationOutcome === 'incomplete' && !incompleteReasons) {
		throw new Error(`validationOutcome requires incompleteReasons`);
	}

	const reasonsList = mapIncompleteReasonsToReasonsList(
		incompleteReasonOptions,
		incompleteReasons,
		otherIncompleteReasons
	);

	/** @type {import('../../../lib/nunjucks-template-builders/summary-list-builder.js').Row[]} */
	const sectionData = [
		{
			title: 'Review outcome',
			value: 'Incomplete',
			valueType: 'text',
			actionText: 'Change',
			actionLink: '#'
		},
		{
			title: 'Incomplete reasons',
			value: reasonsList,
			valueType: 'unorderedList',
			actionText: 'Change',
			actionLink: '#'
		}
	];

	if (updatedDueDate) {
		sectionData.push({
			title: `Updated due date`,
			value: webDateToDisplayDate(updatedDueDate),
			valueType: 'text',
			actionText: 'Change',
			actionLink: '#'
		});
	}

	return { rows: sectionData };
}

/**
 *
 * @param {keyof import('../../appeal.constants.js').appellantCaseReviewOutcomes} validationOutcome
 * @param {string|string[]} [incompleteReasons]
 * @param {string} [otherReasons]
 * @param {import('./lpa-questionnaire.service.js').DayMonthYear} [updatedDueDate]
 * @returns {import('./lpa-questionnaire.service.js').LpaQuestionnaireReviewOutcome}
 */
export function mapWebReviewOutcomeToApiReviewOutcome(
	validationOutcome,
	incompleteReasons,
	otherReasons,
	updatedDueDate
) {
	let parsedReasons;

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
		validationOutcome: String(validationOutcome),
		...(validationOutcome === 'incomplete' &&
			incompleteReasons && { incompleteReasons: parsedReasons }),
		...(otherReasons && { otherNotValidReasons: otherReasons }),
		...(updatedDueDate && {
			lpaQuestionnaireDueDate: dayMonthYearToApiDateString(updatedDueDate)
		})
	};
}
