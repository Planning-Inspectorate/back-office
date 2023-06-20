import { addressToString } from '../../lib/address-formatter.js';
import { convertFromBooleanToYesNo } from '../../lib/boolean-formatter.js';

/**
 *
 * @param {import('apps/web/src/server/appeals/appellant-case/appellant-case.types').SingleAppellantCaseResponse} appellantCaseData
 * @returns {SummaryListBuilderParameters[]}
 */
export function mapAppellantCase(appellantCaseData) {
	const completeList = [];
	const mappedData = mapData(appellantCaseData);
	completeList.push(appellantDataList(mappedData));
	completeList.push(appealSiteDataList(mappedData));
	completeList.push(appealDataList(mappedData));
	return completeList;
}

/**
 * @typedef {import("../../lib/nunjucks-template-builders/summary-list-builder").RowArray} SummaryListBuilderRowArray
 */

/**
 * @typedef {Object<[key: string], SummaryListBuilderRowArray | Array<SummaryListBuilderRowArray>>} MappedAppellantCaseData
 */

/**
 * @typedef {import("../../lib/nunjucks-template-builders/summary-list-builder").BuilderParameters} SummaryListBuilderParameters
 */

/**
 *
 * @param {import("apps/web/src/server/appeals/appellant-case/appellant-case.types").SingleAppellantCaseResponse} appellantCaseData
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
