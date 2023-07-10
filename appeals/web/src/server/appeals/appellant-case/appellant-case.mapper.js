import { addressToString } from '../../lib/address-formatter.js';
import { convertFromBooleanToYesNo } from '../../lib/boolean-formatter.js';
import { capitalize } from 'lodash-es';

/**
 *
 * @param {import('apps/web/src/server/appeals/appellant-case/appellant-case.types').SingleAppellantCaseResponse} appellantCaseData
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
 * @param {import('./appellant-case.service.js').AppellantCaseReviewOutcome} reviewOutcome
 * @param {import('.prisma/client').AppellantCaseInvalidReason[]} invalidReasonOptions
 * @returns {SummaryListBuilderParameters}
 */
export function mapReviewOutcomeToSummaryListBuilderParameters(
	reviewOutcome,
	invalidReasonOptions
) {
	const reasonsContent = [];

	switch (reviewOutcome.validationOutcome) {
		case 'invalid':
			if (!reviewOutcome.invalidReasons) {
				throw new Error('validationOutcome is "invalid" but invalidReasons was not found');
			}
			reviewOutcome.invalidReasons.forEach((reason) => {
				for (const possibleReason of invalidReasonOptions) {
					if (reason === possibleReason.id) {
						const reasonText =
							possibleReason.name.toLowerCase() === 'other'
								? `${possibleReason.name}: ${reviewOutcome.otherNotValidReasons || ''}`
								: possibleReason.name;
						reasonsContent.push(reasonText);
					}
				}
			});
			break;
		case 'incomplete':
			// TODO: BOAT-235
			reasonsContent.push('');
			break;
		default:
			break;
	}

	/** @type {import('../../lib/nunjucks-template-builders/summary-list-builder').Row[]} */
	const sectionData = [
		{
			title: 'Review outcome',
			value: reviewOutcome.validationOutcome,
			valueType: 'text',
			actionText: 'Change',
			actionLink: '#'
		},
		{
			title: `${capitalize(reviewOutcome.validationOutcome)} reasons`,
			value: reasonsContent,
			valueType: 'unorderedList',
			actionText: 'Change',
			actionLink: '#'
		}
	];

	return { rows: sectionData };
}

/**
 *
 * @param {import('.prisma/client').AppellantCaseInvalidReason[]} invalidReasonOptions
 * @param {string[]|number[]} [checkedOptionValues]
 * @returns {import('../appeals.types').CheckboxItemParameter[]}
 */
export function mapInvalidReasonsToCheckboxItemParameters(
	invalidReasonOptions,
	checkedOptionValues
) {
	if (checkedOptionValues && !Array.isArray(checkedOptionValues)) {
		checkedOptionValues = [checkedOptionValues];
	}

	let checkedOptions = checkedOptionValues?.map((value) =>
		typeof value === 'string' ? parseInt(value, 10) : value
	);

	return invalidReasonOptions.map((reason) => ({
		value: `${reason.id}`,
		text: reason.name,
		...(checkedOptions && {
			checked: checkedOptions.includes(reason.id)
		})
	}));
}

/**
 *
 * @param {'valid'|'invalid'|'incomplete'} validationOutcome
 * @param {string|string[]} [invalidReasons]
 * @param {string} [otherNotValidReasons]
 * @returns {import('./appellant-case.service.js').AppellantCaseReviewOutcome}
 */
export function mapPostedReviewOutcomeToApiReviewOutcome(
	validationOutcome,
	invalidReasons,
	otherNotValidReasons
) {
	let parsedInvalidReasons;

	if (invalidReasons) {
		if (!Array.isArray(invalidReasons)) {
			invalidReasons = [invalidReasons];
		}
		parsedInvalidReasons = invalidReasons.map((reason) => parseInt(reason, 10));
		if (!parsedInvalidReasons.every((value) => !Number.isNaN(value))) {
			throw new Error('failed to parse one or more invalid reason IDs to integer');
		}
	}

	return {
		validationOutcome,
		...(invalidReasons && { invalidReasons: parsedInvalidReasons }),
		...(otherNotValidReasons && { otherNotValidReasons })
	};
}

/**
 * @typedef {import("../../lib/nunjucks-template-builders/summary-list-builder").Row} SummaryListBuilderRowArray
 */

/**
 * @typedef {Object<[key: string], SummaryListBuilderRowArray | Array<SummaryListBuilderRowArray>>} MappedAppellantCaseData
 */

/**
 * @typedef {import("../../lib/nunjucks-template-builders/summary-list-builder").BuilderParameters} SummaryListBuilderParameters
 */

/**
 *
 * @param {import("./appellant-case.types").SingleAppellantCaseResponse} appellantCaseData
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
		value: appellantCaseData.documents.applicationForm,
		valueType: 'link',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.decisionLetter = {
		title: 'Decision letter',
		value: appellantCaseData.documents.decisionLetter,
		valueType: 'link',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.appealStatement = {
		title: 'Appeal statement',
		value: appellantCaseData.documents.appealStatement,
		valueType: 'link',
		actionText: 'Change',
		actionLink: '#'
	};

	const hasNewSupportingDocuments = appellantCaseData.documents.newSupportingDocuments.length > 0;

	mappedData.addNewSupportingDocuments = {
		title: 'Add new supporting documents',
		value: convertFromBooleanToYesNo(hasNewSupportingDocuments),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	if (hasNewSupportingDocuments) {
		mappedData.newSupportingDocuments = appellantCaseData.documents.newSupportingDocuments.map(
			(document, index) => ({
				title: index === 0 ? 'New supporting documents' : '',
				value: document,
				valueType: 'link',
				actionText: 'Change',
				actionLink: '#'
			})
		);
	} else {
		mappedData.newSupportingDocuments = [
			{
				title: 'New supporting documents',
				value: 'N/A',
				valueType: 'text',
				actionText: 'Change',
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
