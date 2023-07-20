import { addressToString } from '../../../lib/address-formatter.js';
import { convertFromBooleanToYesNo } from '../../../lib/boolean-formatter.js';
import { dayMonthYearToApiDateString } from '../../../lib/dates.js';
import { capitalize } from 'lodash-es';
import { appellantCaseReviewOutcomes } from '../../appeal.constants.js';
import { mapDocumentsForDisplay } from '../../appeal-documents/appeal-documents.mapper.js';

/**
 *
 * @param {import('./appellant-case.types.js').SingleAppellantCaseResponse} appellantCaseData
 * @returns {SummaryListBuilderParameters[]}
 */
export function mapResponseToSummaryListBuilderParameters(appellantCaseData) {
	const completeList = [];
	const mappedData = mapData(appellantCaseData);
	completeList.push(appellantDataList(mappedData));
	completeList.push(appealSiteDataList(mappedData));
	completeList.push(appealDataList(mappedData));
	return completeList;
}

/**
 *
 * @param {import('appeals/api/src/database/schema.js').AppellantCaseInvalidReason[]|import('appeals/api/src/database/schema.js').AppellantCaseIncompleteReason[]} invalidOrIncompleteReasonOptions
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {string} [otherNotValidReasons]
 * @returns {string[]}
 */
function mapInvalidOrIncompleteReasonsToReasonsList(
	invalidOrIncompleteReasonOptions,
	invalidOrIncompleteReasons,
	otherNotValidReasons
) {
	const reasons = Array.isArray(invalidOrIncompleteReasons)
		? invalidOrIncompleteReasons
		: [invalidOrIncompleteReasons];

	return (
		reasons
			?.map((reason) =>
				invalidOrIncompleteReasonOptions.find((option) => option.id === parseInt(reason || '', 10))
			)
			.map((option) => {
				if (!option) {
					throw new Error('invalid or incomplete reason ID was not recognised');
				}
				const name = option.name;
				return name.toLowerCase() === 'other' ? `${name}: ${otherNotValidReasons || ''}` : name;
			}) || ['']
	);
}

/**
 *
 * @param {import('appeals/api/src/database/schema.js').AppellantCaseInvalidReason[]|import('appeals/api/src/database/schema.js').AppellantCaseIncompleteReason[]} invalidOrIncompleteReasonOptions
 * @param {keyof import('../../appeal.constants.js').appellantCaseReviewOutcomes} validationOutcome
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {string} [otherNotValidReasons]
 * @param {import('./appellant-case.service.js').DayMonthYear} [updatedDueDate]
 * @returns {SummaryListBuilderParameters}
 */
export function mapReviewOutcomeToSummaryListBuilderParameters(
	invalidOrIncompleteReasonOptions,
	validationOutcome,
	invalidOrIncompleteReasons,
	otherNotValidReasons,
	updatedDueDate
) {
	if (
		(validationOutcome === appellantCaseReviewOutcomes.invalid ||
			validationOutcome === appellantCaseReviewOutcomes.incomplete) &&
		!invalidOrIncompleteReasons
	) {
		throw new Error(`validationOutcome "${validationOutcome}" requires invalidOrIncompleteReasons`);
	}

	const reasonsList = mapInvalidOrIncompleteReasonsToReasonsList(
		invalidOrIncompleteReasonOptions,
		invalidOrIncompleteReasons,
		otherNotValidReasons
	);

	/** @type {import('../../../lib/nunjucks-template-builders/summary-list-builder.js').Row[]} */
	const sectionData = [
		{
			title: 'Review outcome',
			value: String(validationOutcome),
			valueType: 'text',
			actionText: 'Change',
			actionLink: '#'
		},
		{
			title: `${capitalize(String(validationOutcome))} reasons`,
			value: reasonsList,
			valueType: 'unorderedList',
			actionText: 'Change',
			actionLink: '#'
		}
	];

	if (updatedDueDate) {
		sectionData.push({
			title: `Updated due date`,
			value: `${updatedDueDate.day}/${updatedDueDate.month}/${updatedDueDate.year}`,
			valueType: 'text',
			actionText: 'Change',
			actionLink: '#'
		});
	}

	return { rows: sectionData };
}

/**
 * @typedef {Object} NotificationBannerComponentParameters
 * @property {string} [html]
 * @property {string} [text]
 * @property {string} [type]
 * @property {string} [role]
 * @property {string} [titleHtml]
 * @property {string} [titleText]
 * @property {string} [titleId]
 * @property {string|number} [titleHeadingLevel]
 * @property {string} [classes]
 * @property {Object.<string, string>|string[][]} [attributes]
 * @property {string} [disableAutoFocus] - templated into value of data-disable-auto-focus attribute
 */

/**
 *
 * @param {keyof import('../../appeal.constants.js').appellantCaseReviewOutcomes} validationOutcome
 * @param {string|string[]} invalidOrIncompleteReasons
 * @param {string} [otherNotValidReasons]
 * @returns {NotificationBannerComponentParameters}
 */
export function mapReviewOutcomeToNotificationBannerComponentParameters(
	validationOutcome,
	invalidOrIncompleteReasons,
	otherNotValidReasons
) {
	if (!Array.isArray(invalidOrIncompleteReasons)) {
		invalidOrIncompleteReasons = [invalidOrIncompleteReasons];
	}

	return {
		titleText: `Appeal is ${String(validationOutcome)}`,
		html: `<ul class="govuk-!-margin-top-0 govuk-!-padding-left-4">${invalidOrIncompleteReasons
			.map((reason) =>
				reason.toLowerCase() === 'other'
					? `<li>${reason}: ${otherNotValidReasons}</li>`
					: `<li>${reason}</li>`
			)
			.join('')}</ul>`
	};
}

/**
 *
 * @param {import('appeals/api/src/database/schema.js').AppellantCaseInvalidReason[]|import('appeals/api/src/database/schema.js').AppellantCaseInvalidReason[]} invalidOrIncompleteReasonOptions
 * @param {string[]|number[]} [checkedOptionValues]
 * @returns {import('../../appeals.types.js').CheckboxItemParameter[]}
 */
export function mapInvalidOrIncompleteReasonsToCheckboxItemParameters(
	invalidOrIncompleteReasonOptions,
	checkedOptionValues
) {
	if (checkedOptionValues && !Array.isArray(checkedOptionValues)) {
		checkedOptionValues = [checkedOptionValues];
	}

	let checkedOptions = checkedOptionValues?.map((value) =>
		typeof value === 'string' ? parseInt(value, 10) : value
	);

	return invalidOrIncompleteReasonOptions.map((reason) => ({
		value: `${reason.id}`,
		text: reason.name,
		...(checkedOptions && {
			checked: checkedOptions.includes(reason.id)
		})
	}));
}

/**
 *
 * @param {keyof import('../../appeal.constants.js').appellantCaseReviewOutcomes} validationOutcome
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {string} [otherNotValidReasons]
 * @param {import('./appellant-case.service.js').DayMonthYear} [updatedDueDate]
 * @returns {import('./appellant-case.service.js').AppellantCaseReviewOutcome}
 */
export function mapWebReviewOutcomeToApiReviewOutcome(
	validationOutcome,
	invalidOrIncompleteReasons,
	otherNotValidReasons,
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
		validationOutcome: String(validationOutcome),
		...(validationOutcome === appellantCaseReviewOutcomes.invalid &&
			invalidOrIncompleteReasons && { invalidReasons: parsedReasons }),
		...(validationOutcome === appellantCaseReviewOutcomes.incomplete &&
			invalidOrIncompleteReasons && { incompleteReasons: parsedReasons }),
		...(otherNotValidReasons && { otherNotValidReasons }),
		...(updatedDueDate && {
			appealDueDate: dayMonthYearToApiDateString(updatedDueDate)
		})
	};
}

/**
 * @typedef {import("../../../lib/nunjucks-template-builders/summary-list-builder.js").Row} SummaryListBuilderRowArray
 */

/**
 * @typedef {Object<[key: string], SummaryListBuilderRowArray | Array<SummaryListBuilderRowArray>>} MappedAppellantCaseData
 */

/**
 * @typedef {import("../../../lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 */

/**
 *
 * @param {import("./appellant-case.types.js").SingleAppellantCaseResponse} appellantCaseData
 * @returns {MappedAppellantCaseData}
 */
function mapData(appellantCaseData) {
	const mappedData = {};

	mappedData.appellantName = {
		title: 'Name',
		value: appellantCaseData.appellant.name,
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.applicantName = {
		title: 'Another individual',
		value:
			appellantCaseData.applicant.firstName && appellantCaseData.applicant.surname
				? `${appellantCaseData.applicant.firstName} ${appellantCaseData.applicant.surname}`
				: appellantCaseData.appellant.name,
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.applicationReference = {
		title: 'Application reference',
		value: appellantCaseData.planningApplicationReference,
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.siteAddress = {
		title: 'Site address',
		value: addressToString({
			addressLine1: appellantCaseData.appealSite.addressLine1 || '',
			addressLine2: appellantCaseData.appealSite.addressLine2 || '',
			postCode: appellantCaseData.appealSite.postCode || '',
			town: appellantCaseData.appealSite.town || ''
		}),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.siteFullyOwned = {
		title: 'Site fully owned',
		value: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.isFullyOwned),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.sitePartiallyOwned = {
		title: 'Site partially owned',
		value: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.isPartiallyOwned),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.allOwnersKnown = {
		title: 'All owners known',
		value: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.areAllOwnersKnown),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.attemptedToIdentifyOwners = {
		title: 'Attempted to identify owners',
		value: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.hasAttemptedToIdentifyOwners),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.advertisedAppeal = {
		title: 'Advertised appeal',
		value: convertFromBooleanToYesNo(appellantCaseData.hasAdvertisedAppeal),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.visibility = {
		title: 'Visibility',
		value: convertFromBooleanToYesNo(appellantCaseData.visibility.isVisible),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.healthAndSafetyIssues = {
		title: 'Site health and safety issues',
		value: convertFromBooleanToYesNo(appellantCaseData.healthAndSafety.hasIssues),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.applicationForm = {
		title: 'Application form known',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.applicationForm
		)
	};

	mappedData.decisionLetter = {
		title: 'Decision letter',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.decisionLetter
		)
	};

	mappedData.appealStatement = {
		title: 'Appeal statement',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.appealStatement
		)
	};

	const hasNewSupportingDocuments =
		appellantCaseData.documents.newSupportingDocuments.documents.length > 0;

	mappedData.addNewSupportingDocuments = {
		title: 'Add new supporting documents',
		value: convertFromBooleanToYesNo(hasNewSupportingDocuments),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	if (appellantCaseData.hasNewSupportingDocuments) {
		mappedData.newSupportingDocuments =
			appellantCaseData.documents.newSupportingDocuments.documents.map((document, index) => ({
				title: index === 0 ? 'New supporting documents' : '',
				...mapDocumentsForDisplay(
					appellantCaseData.appealId,
					appellantCaseData.documents.newSupportingDocuments
				)
			}));
	} else {
		mappedData.newSupportingDocuments = [
			{
				title: 'New supporting documents',
				value: 'none',
				valueType: 'text',
				actionText: 'Add',
				actionLink: '#'
			}
		];
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
		...mappedData.newSupportingDocuments
	];

	return { header: header, rows: sectionData };
}
