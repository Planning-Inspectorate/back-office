import { mergeSections } from './applications-examination-library-index.view-model.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import {
	getResultsPerPage,
	showingPage
} from '../../common/components/pagination/pagination-results-per-page.js';
import { getPaginationLinks } from '../../common/components/pagination/pagination-links.js';
import { tableSortingHeaderLinks } from '../../common/components/table/table-sorting-header-links.js';

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibraryItem} ExaminationLibraryItem
 */

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibrarySection} ExaminationLibrarySection
 */

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibraryDynamicSection} ExaminationLibraryDynamicSection
 */

/**
 * Get Examination Library section data from section item slug
 *
 * @param {ExaminationLibrarySection[]} staticSections
 * @param {ExaminationLibraryDynamicSection[]} dynamicSections
 * @param {string} itemSlug
 * @returns {ExaminationLibrarySection|null}
 */
export const getSectionByItemSlug = (staticSections, dynamicSections, itemSlug) => {
	const sections = mergeSections(staticSections, dynamicSections);
	const section = sections.find((section) => section.items.some((item) => item.href === itemSlug));
	return section ? section : null;
};

/**
 * Get Examination Library category code
 *
 * @param {ExaminationLibrarySection} section
 * @param {object} categoryCodes
 * @returns {string}
 */
export const getCategoryCode = (section, categoryCodes) => {
	const sectionSlug = section.slug;
	const categoryCodeKeys = /** @type {Array<keyof typeof categoryCodes>} */ (
		Object.keys(categoryCodes)
	);
	const sectionCategoryCode = categoryCodeKeys.find((key) => categoryCodes[key] === sectionSlug);

	return sectionCategoryCode ? sectionCategoryCode : '';
};

/**
 * @typedef {object} ExaminationLibraryDocumentVersion
 * @property {string} publishedStatus
 * @property {string} mime
 * @property {string} documentGuid
 * @property {number} version
 * @property {string} fileName
 * @property {string} description
 */

/**
 * @typedef {object} ExaminationLibrarySectionDocument
 * @property {number} caseId
 * @property {ExaminationLibraryDocumentVersion} latestDocumentVersion
 */

/**
 * Get document description as hyperlink or plain text based on publish status and file type
 *
 * @param {ExaminationLibrarySectionDocument} sectionDocument
 * @returns {string}
 */

export const getDocumentDescriptionHTML = (sectionDocument) => {
	if (
		!sectionDocument?.latestDocumentVersion ||
		!Object.keys(sectionDocument.latestDocumentVersion).length
	) {
		return '';
	}

	const isNotDisabled =
		sectionDocument.latestDocumentVersion.publishedStatus !== 'awaiting_upload' &&
		sectionDocument.latestDocumentVersion.publishedStatus !== 'awaiting_virus_check' &&
		sectionDocument.latestDocumentVersion.publishedStatus !== 'failed_virus_check';

	const isPreviewActive =
		isNotDisabled &&
		(sectionDocument.latestDocumentVersion.mime === 'application/pdf' ||
			sectionDocument.latestDocumentVersion.mime === 'image/jpeg' ||
			sectionDocument.latestDocumentVersion.mime === 'image/png');

	const documentPreviewURL = url('document-download', {
		caseId: sectionDocument.caseId,
		documentGuid: sectionDocument.latestDocumentVersion.documentGuid,
		version: sectionDocument.latestDocumentVersion.version,
		isPreviewActive: isPreviewActive
	});

	let documentDescriptionHTML;

	if (isPreviewActive) {
		documentDescriptionHTML = `<a href="${documentPreviewURL}" class="govuk-link">${sectionDocument.latestDocumentVersion.description}</a>`;
	} else {
		documentDescriptionHTML = sectionDocument.latestDocumentVersion.description;
	}

	return documentDescriptionHTML;
};

/**
 * @param {any} query
 * @param {object} documents
 * @param {number} documents.page
 * @param {number} documents.pageSize
 * @param {number} documents.pageCount
 * @param {number} documents.itemCount
 * @param {string} examinationLibraryUrl
 * @returns {import('../../../views/applications/components/pagination/pagination.js').Pagination.Info}
 */
export const getExaminationLibraryPagination = (
	query,
	{ page, pageSize, pageCount, itemCount },
	examinationLibraryUrl
) => ({
	showing: showingPage(page, pageSize, pageCount, itemCount),
	resultsPerPage: getResultsPerPage(query, examinationLibraryUrl),
	paginationLinks: getPaginationLinks(page, pageCount, query, examinationLibraryUrl)
});

/**
 * @param {object} query
 * @param {string[]} headers
 * @param {string} sectionUrl
 * @param {boolean} isPublished
 * @returns {import('../../common/components/table/table-sorting-header-links.js').TableHeaderLink[]}
 */
export const tableSortLinks = (query, headers, sectionUrl, isPublished) =>
	headers.map((header) => {
		switch (header) {
			case 'Reference':
				return tableSortingHeaderLinks(
					query,
					header,
					isPublished ? 'examinationRefNo' : '',
					sectionUrl
				);

			case 'Document description':
				return tableSortingHeaderLinks(query, header, 'description', sectionUrl);

			case 'From':
				return tableSortingHeaderLinks(query, header, 'author', sectionUrl);

			case 'Status':
				return tableSortingHeaderLinks(query, header, 'publishedStatus', sectionUrl);

			default:
				return tableSortingHeaderLinks(query, header, '', sectionUrl);
		}
	});
