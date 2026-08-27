import { url } from '../../../lib/nunjucks-filters/url.js';
import { getExaminationLibraryCategories } from './documentation-metadata.service.js';

/** @typedef {"name" | "description" | "descriptionWelsh" | "published-date" | "receipt-date"| "redaction" | "published-status" | "type"|"webfilter" | "webfilterWelsh" | "agent"| "author" | "authorWelsh" | "transcript" | "interestedPartyNumber" | "party-type"|"examination-library-category"} MetaDataNames */
/** @typedef {{label?: string, metaDataName: string, metaDataType?: string, hint?: string, pageTitle?: string, backLink?: string, maxLength?: number, template?: string, englishLabel?: string, metaDataEnglishName?: string, items?: {value: boolean|string|number, text: string, checked?: boolean, hint?: {text: string}, categoryCode?: string, children?: {value: number, text: string, selected?: boolean}[]}[]}} MetaDataLayoutParams */
/** @typedef {{documentGuid: string, metaDataName: MetaDataNames}} RequestParams */
/** @typedef {import('../../applications.types').DocumentationFile} DocumentationFile */

/** @typedef {{case: {isMaterialChange: boolean}, caseId: number, folderId: number, documentMetaData: DocumentationFile, documentGuid: string}} ResponseLocals */

/** @typedef {import('../../applications.types.js').ExaminationLibraryCategory} ExaminationLibraryCategory */

/**
 * @typedef {Object} ExaminationLibraryCategoryItem
 * @property {number|string} value
 * @property {string} text
 * @property {string} categoryCode
 * @property {boolean=} checked
 * @property {{value: number, text: string, selected?: boolean}[]=} children
 */

/**
 * @typedef {Pick<ExaminationLibraryCategory,
 * 'id' | 'categoryCode' | 'categoryName' | 'source'>} ExaminationLibraryCategoryForView
 */

/** @type {Record<MetaDataNames, MetaDataLayoutParams>} */
export const viewModels = {
	name: {
		label: 'Document file name',
		metaDataName: 'fileName',
		template: 'documentation-edit-textinput.njk'
	},
	description: {
		label: 'Document description',
		metaDataName: 'description',
		template: 'documentation-edit-textarea.njk'
	},
	descriptionWelsh: {
		label: 'Document description in Welsh',
		metaDataName: 'descriptionWelsh',
		englishLabel: 'Document description in English',
		metaDataEnglishName: 'description',
		template: 'documentation-edit-textarea.njk'
	},
	interestedPartyNumber: {
		label: 'Interested Party number (optional)',
		metaDataName: 'interestedPartyNumber',
		template: 'documentation-edit-textinput.njk'
	},
	'party-type': {
		items: [
			{ value: 'Applicant', text: 'Applicant' },
			{ value: 'Local authority', text: 'Local authority' },
			{
				value: 'Other council',
				text: 'Other council',
				hint: {
					text: 'For example, parish council, community council or town council'
				}
			},
			{ value: 'Statutory body', text: 'Statutory body' },
			{ value: 'Interested organisation', text: 'Interested organisation' },
			{ value: 'Individual', text: 'Individual' },
			{ value: 'Planning Inspectorate', text: 'Planning Inspectorate' }
		],
		pageTitle: 'Type of party',
		label: 'Type of party',
		metaDataName: 'typeOfParty',
		metaDataType: 'radios'
	},
	webfilter: {
		label: 'Webfilter',
		metaDataName: 'filter1',
		template: 'documentation-edit-textarea.njk'
	},
	webfilterWelsh: {
		label: 'Webfilter in Welsh',
		metaDataName: 'filter1Welsh',
		englishLabel: 'Webfilter in English',
		metaDataEnglishName: 'filter1',
		template: 'documentation-edit-textarea.njk'
	},
	agent: {
		label: 'Agent name (optional)',
		metaDataName: 'representative',
		template: 'documentation-edit-textinput.njk'
	},
	author: {
		label: 'Who the document is from',
		metaDataName: 'author',
		template: 'documentation-edit-textarea.njk'
	},
	authorWelsh: {
		label: 'Who the document is from in Welsh',
		englishLabel: 'Who the document is from in English',
		metaDataName: 'authorWelsh',
		metaDataEnglishName: 'author',
		template: 'documentation-edit-textarea.njk'
	},
	'published-date': {
		label: 'Date document published',
		hint: 'for example, 27 03 2023',
		pageTitle: 'Enter the document published date',
		metaDataName: 'datePublished',
		metaDataType: 'date'
	},
	'receipt-date': {
		label: 'Date received',
		hint: 'for example, 27 03 2023',
		pageTitle: 'Enter date received',
		metaDataName: 'dateCreated',
		metaDataType: 'date'
	},
	redaction: {
		items: [
			{ value: 'redacted', text: 'Redacted' },
			{ value: 'not_redacted', text: 'Unredacted', checked: true },
			{ value: 'no_redaction_required', text: 'Redaction not needed' }
		],
		pageTitle: 'Select the redaction status',
		label: 'Redaction',
		metaDataName: 'redactedStatus',
		metaDataType: 'radios'
	},
	'published-status': {
		items: [
			{ value: 'not_checked', text: 'Not checked' },
			{ value: 'checked', text: 'Checked' },
			{ value: 'ready_to_publish', text: 'Ready to publish' },
			{ value: 'do_not_publish', text: 'Do not publish' }
		],
		pageTitle: 'Select the document status',
		label: 'Status',
		metaDataName: 'publishedStatus',
		metaDataType: 'radios'
	},
	transcript: {
		label: 'Transcript (optional)',
		hint: 'E.g. TR010060-000110',
		metaDataName: 'transcript',
		template: 'documentation-edit-textinput.njk'
	},
	type: {
		items: [
			{
				value: 'DCO decision letter (SoS)(approve)',
				text: 'DCO decision letter (SoS)(approve)'
			},
			{
				value: 'DCO decision letter (SoS)(refuse)',
				text: 'DCO decision letter (SoS)(refuse)'
			},
			{
				value: 'Event recording',
				text: 'Event recording'
			},
			{
				value: 'Event recording transcript',
				text: 'Event recording transcript'
			},
			{
				value: 'Exam library',
				text: 'Exam library'
			},
			{
				value: 'Rule 6 letter',
				text: 'Rule 6 letter'
			},
			{
				value: 'Rule 8 letter',
				text: 'Rule 8 letter'
			},
			{
				value: '',
				text: 'No document type'
			}
		],
		pageTitle: 'Select the document type',
		label: 'Document type',
		metaDataName: 'documentType',
		metaDataType: 'radios'
	},
	'examination-library-category': {
		pageTitle: 'Examination library category',
		label: 'Examination library category',
		metaDataName: 'examinationLibraryCategoryId',
		metaDataType: 'radios',
		template: 'documentation-edit-examination-library-category.njk'
	}
};

/**
 * Create layout parameters for metadata pages
 *
 * @param {RequestParams} requestParameters
 * @param {ResponseLocals} responseLocals
 * @returns {MetaDataLayoutParams | null}
 */
const getBaseViewModel = (requestParameters, responseLocals) => {
	const { documentGuid, metaDataName } = requestParameters;
	const { caseId, folderId, case: caseData } = responseLocals;

	const backLink = url('document', {
		caseId,
		folderId,
		documentGuid,
		step: 'properties'
	});

	const viewModel = viewModels[metaDataName];
	if (!viewModel) {
		return null;
	}

	if (viewModel.metaDataName === 'documentType' && viewModel.items) {
		viewModel.items = viewModel.items.map((item) => {
			if (item.value === 'Rule 6 letter') {
				return {
					...item,
					text: caseData.isMaterialChange ? 'Regulation 27 and 28 letter' : 'Rule 6 letter'
				};
			} else if (item.value === 'Rule 8 letter') {
				return {
					...item,
					text: caseData.isMaterialChange ? 'Regulation 30 letter' : 'Rule 8 letter'
				};
			}

			return item;
		});
	}

	return { ...viewModel, backLink };
};

/**
 * @param {RequestParams} requestParameters
 * @param {ResponseLocals} responseLocals
 * @returns {Promise<MetaDataLayoutParams | null>}
 */
export const getMetadataViewModel = async (requestParameters, responseLocals) => {
	const viewModel = getBaseViewModel(requestParameters, responseLocals);

	if (!viewModel) {
		return null;
	}

	switch (requestParameters.metaDataName) {
		case 'examination-library-category': {
			const categories = await getExaminationLibraryCategories(responseLocals.caseId);

			return {
				...viewModel,
				items: mapExaminationLibraryCategories(
					categories,
					responseLocals.documentMetaData.examinationLibraryCategoryId ?? null
				)
			};
		}

		default:
			return viewModel;
	}
};

const categoryOrder = ['NELC', 'APP', 'AoC', 'PD', 'AS', 'OD'];

/** @type {Record<string, string>} */
const groupedCategoryLabels = {
	APP: 'Application documents'
};

/**
 * Map Examination Library categories returned from the API into
 * the structure required by the metadata page.
 *
 * Categories that share a category code are rendered as a parent
 * radio option with the individual categories shown in a select.
 *
 * @param {ExaminationLibraryCategoryForView[]} categories
 * @param {number | null} selectedCategoryId
 * @returns {ExaminationLibraryCategoryItem[]}
 */
export const mapExaminationLibraryCategories = (categories, selectedCategoryId) => {
	const staticCategories = categories.filter((category) => category.source === 'STATIC');

	/** @type {ExaminationLibraryCategoryItem[]} */
	const items = [];

	for (const categoryCode of categoryOrder) {
		const matchingCategories = staticCategories.filter(
			(category) => category.categoryCode === categoryCode
		);

		if (matchingCategories.length === 0) {
			continue;
		}

		if (matchingCategories.length === 1) {
			const category = matchingCategories[0];

			items.push({
				value: category.id,
				text:
					categoryCode === 'NELC'
						? category.categoryName
						: `${category.categoryName} (${categoryCode})`,
				categoryCode,
				checked: category.id === selectedCategoryId
			});

			continue;
		}

		const label = groupedCategoryLabels[categoryCode];

		const hasSelectedChild = matchingCategories.some(
			(category) => category.id === selectedCategoryId
		);

		items.push({
			value: categoryCode,
			text: `${label} (${categoryCode})`,
			categoryCode,
			checked: hasSelectedChild,
			children: matchingCategories.map((category) => ({
				value: category.id,
				text: category.categoryName,
				selected: category.id === selectedCategoryId
			}))
		});
	}

	return items;
};
