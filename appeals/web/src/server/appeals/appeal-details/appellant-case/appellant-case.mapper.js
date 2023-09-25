import { addressToString } from '../../../lib/address-formatter.js';
import { convertFromBooleanToYesNo } from '../../../lib/boolean-formatter.js';
import { dayMonthYearToApiDateString, webDateToDisplayDate } from '../../../lib/dates.js';
import { capitalize } from 'lodash-es';
import { appellantCaseReviewOutcomes } from '../../appeal.constants.js';
import { mapFolder } from '#appeals/appeal-documents/appeal-documents.mapper.js';

/**
 * @typedef {import('./appellant-case.service.js').AppellantCaseInvalidIncompleteReasonOption} AppellantCaseInvalidIncompleteReasonOption
 * @typedef {import('./appellant-case.service.js').AppellantCaseInvalidIncompleteReason} AppellantCaseInvalidIncompleteReason
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
 * @typedef {import('@pins/appeals.api').Appeals.DocumentInfo} DocumentInfo
 * @typedef {import('../../appeal-documents/appeal-documents.mapper.js').MappedFolderForListBuilder} MappedFolderForListBuilder
 * @typedef {import('../../appeal-documents/appeal-documents.mapper.js').MappedDocumentForListBuilder} MappedDocumentForListBuilder
 * @typedef {import('#lib/nunjucks-template-builders/summary-list-builder.js').HtmlTagType} HtmlTagType
 * @typedef {import('#lib/nunjucks-template-builders/tag-builders.js').HtmlLink} HtmlLink
 * MappedFolderForListBuilder
 */

/**
 *
 * @param {import('./appellant-case.types.js').SingleAppellantCaseResponse} appellantCaseData
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
 * @param {AppellantCaseInvalidIncompleteReasonOption[]} invalidOrIncompleteReasonOptions
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {Object<string, string[]>} [invalidOrIncompleteReasonsText]
 * @returns {Array<string|string[]>}
 */
function mapInvalidOrIncompleteReasonsToList(
	invalidOrIncompleteReasonOptions,
	invalidOrIncompleteReasons,
	invalidOrIncompleteReasonsText
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

				/** @type {string[]} */
				let textItems = [];

				if (
					option.hasText &&
					invalidOrIncompleteReasonsText &&
					invalidOrIncompleteReasonsText[option.id]
				) {
					textItems = invalidOrIncompleteReasonsText[option.id];
				}

				/** @type {Array<string|string[]>} */
				const list = [`${option.name}${textItems.length ? ':' : ''}`];

				if (textItems.length) {
					list.push(textItems);
				}

				return list;
			})
			.flat() || ['']
	);
}

/**
 *
 * @param {number} appealId
 * @param {AppellantCaseInvalidIncompleteReasonOption[]} invalidOrIncompleteReasonOptions
 * @param {keyof import('../../appeal.constants.js').appellantCaseReviewOutcomes} validationOutcome
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {Object<string, string[]>} [invalidOrIncompleteReasonsText]
 * @param {import('./appellant-case.service.js').DayMonthYear} [updatedDueDate]
 * @returns {SummaryListBuilderParameters}
 */
export function mapReviewOutcomeToSummaryListBuilderParameters(
	appealId,
	invalidOrIncompleteReasonOptions,
	validationOutcome,
	invalidOrIncompleteReasons,
	invalidOrIncompleteReasonsText,
	updatedDueDate
) {
	if (
		(validationOutcome === appellantCaseReviewOutcomes.invalid ||
			validationOutcome === appellantCaseReviewOutcomes.incomplete) &&
		!invalidOrIncompleteReasons
	) {
		throw new Error(`validationOutcome "${validationOutcome}" requires invalidOrIncompleteReasons`);
	}

	const reasonsList = mapInvalidOrIncompleteReasonsToList(
		invalidOrIncompleteReasonOptions,
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
			actionText: 'Change',
			actionLink: `/appeals-service/appeal-details/${appealId}/appellant-case`
		},
		{
			title: `${capitalize(validationOutcomeAsString)} reasons`,
			value: reasonsList,
			valueType: 'unorderedList',
			actionText: 'Change',
			actionLink: `/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcomeAsString.toLowerCase()}`
		}
	];

	if (updatedDueDate) {
		sectionData.push({
			title: `Updated due date`,
			value: webDateToDisplayDate(updatedDueDate),
			valueType: 'text',
			actionText: 'Change',
			actionLink: `/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcomeAsString.toLowerCase()}/date`
		});
	}

	return { rows: sectionData };
}

/**
 * @typedef {Object} NotificationBannerComponentParameters - TODO: replace with global GDS component parameter type when available
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
 * @param {AppellantCaseInvalidIncompleteReason[]} invalidOrIncompleteReasons
 * @returns {NotificationBannerComponentParameters}
 */
export function mapReviewOutcomeToNotificationBannerComponentParameters(
	validationOutcome,
	invalidOrIncompleteReasons
) {
	if (!Array.isArray(invalidOrIncompleteReasons)) {
		invalidOrIncompleteReasons = [invalidOrIncompleteReasons];
	}

	return {
		titleText: `Appeal is ${String(validationOutcome)}`,
		html: `<ul class="govuk-!-margin-top-0 govuk-!-padding-left-4">${invalidOrIncompleteReasons
			.map(
				(reason) =>
					`<li>${reason?.name?.name}${reason?.text?.length ? ':' : ''}</li>${
						reason?.text?.length ? mapReasonTextToUnorderedList(reason?.text) : ''
					}`
			)
			.join('')}</ul>`
	};
}

/**
 *
 * @param {string[]} reasonText
 * @returns {string}
 */
function mapReasonTextToUnorderedList(reasonText) {
	return `<ul class="govuk-!-margin-top-0 govuk-!-padding-left-4">
		${reasonText.map((textItem) => `<li>${textItem}</li>`).join('')}
	</ul>`;
}

/**
 * @typedef {Object<string, string|string[]>} AppellantCaseBodyValidationOutcome
 * @property {string|string[]} [invalidReason]
 * @property {string|string[]} [incompleteReason]
 */

/**
 * @typedef {Object} AppellantCaseSessionValidationOutcome
 * @property {string} appealId
 * @property {import('../../appeal.constants.js').AppellantCaseReviewOutcome} validationOutcome
 * @property {string|string[]} invalidOrIncompleteReasons
 * @property {Object<string, string[]>} invalidOrIncompleteReasonsText
 */

/**
 * @typedef {Object} AppellantCaseAPIValidationOutcome
 * @property {import('../../appeal.constants.js').AppellantCaseReviewOutcome} outcome
 * @property {AppellantCaseInvalidIncompleteReason[]} [invalidReasons]
 * @property {AppellantCaseInvalidIncompleteReason[]} [incompleteReasons]
 */

/**
 *
 * @param {import('../../appeal.constants.js').AppellantCaseReviewOutcome} validationOutcome
 * @param {AppellantCaseInvalidIncompleteReasonOption[]} invalidOrIncompleteReasonOptions
 * @param {AppellantCaseBodyValidationOutcome} [bodyValidationOutcome]
 * @param {AppellantCaseSessionValidationOutcome} [sessionValidationOutcome]
 * @param {AppellantCaseAPIValidationOutcome} [existingValidationOutcome]
 * @returns {import('../../appeals.types.js').CheckboxItemParameter[]}
 */
export function mapInvalidOrIncompleteReasonOptionsToCheckboxItemParameters(
	validationOutcome,
	invalidOrIncompleteReasonOptions,
	bodyValidationOutcome,
	sessionValidationOutcome,
	existingValidationOutcome
) {
	/** @type {AppellantCaseInvalidIncompleteReason[]} */
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
	const bodyValidationOutcomeReasons = bodyValidationOutcome?.[bodyValidationBaseKey];

	let notValidReasonIds =
		bodyValidationOutcomeReasons ||
		sessionValidationOutcome?.invalidOrIncompleteReasons ||
		existingReasonIds;

	if (typeof notValidReasonIds !== 'undefined' && !Array.isArray(notValidReasonIds)) {
		notValidReasonIds = [notValidReasonIds];
	}
	const checkedOptions = notValidReasonIds?.map((value) =>
		typeof value === 'string' ? parseInt(value, 10) : value
	);

	return invalidOrIncompleteReasonOptions.map((reason) => {
		const addAnotherTextItemsFromExistingOutcome = getAddAnotherTextItemsFromExistingOutcome(
			reason,
			existingReasons
		);
		const addAnotherTextItemsFromSession = getAddAnotherTextItemsFromSession(
			reason,
			sessionValidationOutcome
		);
		const addAnotherTextItemsFromBody = getAddAnotherTextItemsFromBody(
			reason,
			bodyValidationOutcome,
			bodyValidationBaseKey
		);

		let textItems = [''];

		if (addAnotherTextItemsFromBody) {
			textItems = addAnotherTextItemsFromBody;
		} else if (addAnotherTextItemsFromSession) {
			textItems = addAnotherTextItemsFromSession;
		} else if (addAnotherTextItemsFromExistingOutcome) {
			textItems = addAnotherTextItemsFromExistingOutcome;
		}

		const mappedCheckboxItemParameter = {
			value: `${reason.id}`,
			text: reason.name,
			...(checkedOptions && {
				checked: checkedOptions.includes(reason.id)
			}),
			...(reason.hasText && {
				addAnother: { textItems }
			})
		};

		return mappedCheckboxItemParameter;
	});
}

/**
 *
 * @param {AppellantCaseInvalidIncompleteReasonOption} reason
 * @param {AppellantCaseInvalidIncompleteReason[]} existingReasons
 * @returns {string[]|undefined}
 */
function getAddAnotherTextItemsFromExistingOutcome(reason, existingReasons) {
	return (
		existingReasons.find((existingReason) => existingReason?.name?.id === reason.id)?.text || ['']
	);
}

/**
 *
 * @param {AppellantCaseInvalidIncompleteReasonOption} reason
 * @param {AppellantCaseSessionValidationOutcome|undefined} sessionValidationOutcome
 * @returns {string[]|undefined}
 */
function getAddAnotherTextItemsFromSession(reason, sessionValidationOutcome) {
	return sessionValidationOutcome?.invalidOrIncompleteReasonsText?.[reason.id];
}

/**
 *
 * @param {AppellantCaseInvalidIncompleteReasonOption} reason
 * @param {AppellantCaseBodyValidationOutcome|undefined} bodyValidationOutcome
 * @param {string} bodyValidationBaseKey
 * @returns {string[]|undefined}
 */
function getAddAnotherTextItemsFromBody(reason, bodyValidationOutcome, bodyValidationBaseKey) {
	let addAnotherTextItemsFromBody =
		Object.keys(bodyValidationOutcome || {}).length &&
		(bodyValidationOutcome || {})[`${bodyValidationBaseKey}-${reason.id}`];

	if (addAnotherTextItemsFromBody) {
		if (!Array.isArray(addAnotherTextItemsFromBody)) {
			return [addAnotherTextItemsFromBody];
		}

		return addAnotherTextItemsFromBody;
	}
}

/**
 *
 * @param {keyof import('../../appeal.constants.js').appellantCaseReviewOutcomes} validationOutcome
 * @param {string|string[]} [invalidOrIncompleteReasons]
 * @param {Object<string, string[]>} [invalidOrIncompleteReasonsText]
 * @param {import('./appellant-case.service.js').DayMonthYear} [updatedDueDate]
 * @returns {import('./appellant-case.service.js').AppellantCaseReviewOutcome}
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
		validationOutcome: String(validationOutcome),
		...(validationOutcome === appellantCaseReviewOutcomes.invalid &&
			invalidOrIncompleteReasons && {
				invalidReasons: parsedReasons?.map((reason) => ({
					id: reason,
					...(invalidOrIncompleteReasonsText &&
						invalidOrIncompleteReasonsText[reason] && {
							text: invalidOrIncompleteReasonsText[reason]
						})
				}))
			}),
		...(validationOutcome === appellantCaseReviewOutcomes.incomplete &&
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
 * @param {import('#app/auth/auth.pipes.js').CurrentPermissionSet} permissions
 * @returns {MappedAppellantCaseData}
 */
function mapData(appellantCaseData, permissions) {
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
			town: appellantCaseData.appealSite.town || '',
			county: appellantCaseData.appealSite.county || ''
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
			appellantCaseData.documents.applicationForm,
			!permissions.setAppellantCaseData
		)
	};

	mappedData.decisionLetter = {
		title: 'Decision letter',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.decisionLetter,
			!permissions.setAppellantCaseData
		)
	};

	mappedData.appealStatement = {
		title: 'Appeal statement',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.appealStatement,
			!permissions.setAppellantCaseData
		)
	};

	const hasNewSupportingDocuments =
		appellantCaseData.documents.newSupportingDocuments.documents?.length > 0;

	mappedData.addNewSupportingDocuments = {
		title: 'Add new supporting documents',
		value: convertFromBooleanToYesNo(hasNewSupportingDocuments),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.newSupportingDocuments = {
		title: 'New supporting documents',
		...mapDocumentsForDisplay(
			appellantCaseData.appealId,
			appellantCaseData.documents.newSupportingDocuments,
			!permissions.setAppellantCaseData,
			false
		)
	};

	if (!permissions.setAppellantCaseData) {
		Object.keys(mappedData).forEach((key) => {
			// @ts-ignore
			mappedData[key].actionText = '';
			// @ts-ignore
			mappedData[key].actionLink = '';
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
 * @typedef {Object} MappedDocumentRow
 * @property {(string[] | string | HtmlLink[] | HtmlLink)} value
 * @property {string} actionText
 * @property {string} actionLink
 * @property {import('#lib/nunjucks-template-builders/summary-list-builder.js').HtmlTagType} valueType
 * @property {{[key: string]: string} | null} [attributes]
 */
/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 * @param {boolean?} [readOnly]
 * @param {boolean?} [singleDocument]
 * @returns {MappedDocumentRow}
 */
const mapDocumentsForDisplay = (caseId, folder, readOnly = false, singleDocument = true) => {
	const mappedFolder = mapFolder(caseId, folder, singleDocument);
	const { documents } = mappedFolder;
	if (singleDocument && documents?.length) {
		const d = documents[0];
		return {
			value: { ...d, target: '_docpreview' },
			actionText: readOnly ? '' : 'Change',
			actionLink: readOnly ? '' : d.addVersionUrl,
			valueType: 'link'
		};
	} else if (!documents?.length) {
		return {
			value: 'none',
			actionText: readOnly ? '' : 'Add',
			actionLink: readOnly ? '' : mappedFolder.addDocumentUrl,
			valueType: 'text'
		};
	}

	return {
		value: documents.map((/** @type {MappedDocumentForListBuilder} */ d) => {
			return { ...d, target: '_docpreview' };
		}),
		actionText: readOnly ? '' : 'Add',
		actionLink: readOnly ? '' : mappedFolder.addDocumentUrl,
		valueType: 'link'
	};
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {'invalidReason'|'incompleteReason'} reasonKey
 * @returns {Object<string, string[]>}
 */
export function getInvalidOrIncompleteReasonsTextFromRequestBody(request, reasonKey) {
	if (!request.body[reasonKey]) {
		throw new Error(`reasonKey "${reasonKey}" not found in request.body`);
	}

	/** @type {Object<string, string[]>} */
	const reasonsText = {};

	let bodyReasonIds = Array.isArray(request.body[reasonKey])
		? request.body[reasonKey]
		: [request.body[reasonKey]];

	for (const reasonId of bodyReasonIds) {
		const textItemsKey = `${reasonKey}-${reasonId}`;

		if (request.body[textItemsKey]) {
			const reasonsTextKey = `${reasonId}`;
			reasonsText[reasonsTextKey] = Array.isArray(request.body[textItemsKey])
				? request.body[textItemsKey]
				: [request.body[textItemsKey]];

			reasonsText[reasonsTextKey] = reasonsText[reasonsTextKey].filter(
				(reason) => reason.length > 0
			);
		}
	}

	return reasonsText;
}
