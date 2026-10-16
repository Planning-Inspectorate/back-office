import { examinationLibrarySections, categoryCodes } from './examination-library.constants.js';
import { buildTable } from '../../../lib/table-mapper.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import { getSectionByItemSlug, getCategoryCode } from './applications-examination-library-utils.js';

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibrarySection} ExaminationLibrarySection
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibraryDynamicSection} ExaminationLibraryDynamicSection
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibrarySectionDocument} ExaminationLibrarySectionDocument
 */

/**
 * Get Examination Library check details and publish view model.
 *
 * @param {{
 *   dynamicSections?: ExaminationLibraryDynamicSection[],
 *   section?: ExaminationLibrarySection,
 *   sectionDocuments: Array<any>,
 *   totalPublishedCount: number,
 *   unpublishedCount: number,
 *   itemSlug: string,
 *   caseId: number,
 *   projectName?: string,
 *   publishUrl?: string
 * }} params
 * @returns {object | null}
 */
export const getExaminationLibraryPublishViewModel = ({
	dynamicSections = [],
	section,
	sectionDocuments = [],
	totalPublishedCount = 0,
	unpublishedCount = 0,
	itemSlug,
	caseId,
	projectName = '',
	publishUrl
}) => {
	// TODO: Return null or handle empty datasets when sectionDocuments is empty. The view model should not prepare publication data for zero items.
	const resolvedSection =
		section || getSectionByItemSlug(examinationLibrarySections, dynamicSections, itemSlug);

	if (!resolvedSection) {
		return null;
	}

	const item = resolvedSection.items.find((item) => item.href === itemSlug);

	if (!item) {
		return null;
	}

	const sectionHeading = item.title;
	const tableHeaders = ['Reference', 'Document', 'From'];
	const backLink = url('examination-library-section', { caseId, slug: itemSlug });
	const formPublishUrl =
		publishUrl || url('examination-library-publish', { caseId, slug: itemSlug });

	const tableRows = sectionDocuments.map((sectionDocument) => {
		if (
			!sectionDocument?.latestDocumentVersion ||
			!Object.keys(sectionDocument.latestDocumentVersion).length
		) {
			return [];
		}

		if (sectionDocument.isDeleted) {
			return [{ text: '' }, { text: 'Document has been deleted' }, { text: '' }];
		}

		const ref =
			sectionDocument.latestDocumentVersion.draftExaminationLibraryReference ||
			sectionDocument.latestDocumentVersion.examinationRefNo ||
			'';
		const refCell = ref ? { html: `<strong>${ref}</strong>` } : { text: '' };

		const documentPropertiesURL = url('document', {
			caseId: sectionDocument.caseId,
			folderId: sectionDocument.folderId,
			documentGuid: sectionDocument.latestDocumentVersion.documentGuid,
			step: 'properties'
		});

		const docName =
			sectionDocument.latestDocumentVersion.description ||
			sectionDocument.latestDocumentVersion.fileName ||
			'Document';

		const documentCell = {
			html: `<a href="${documentPropertiesURL}" class="govuk-link">${docName}</a>`
		};

		const author = sectionDocument.latestDocumentVersion.author || '';
		const fromCell = { text: author };

		return [refCell, documentCell, fromCell];
	});

	const sectionTableData = buildTable({
		headers: tableHeaders,
		rows: tableRows,
		caption: sectionHeading
	});

	const sectionTable = {
		...sectionTableData,
		captionClasses: 'govuk-visually-hidden'
	};

	const sectionCategoryCode = getCategoryCode(resolvedSection, categoryCodes);

	return {
		selectedPageType: 'examination-library',
		pageTitle: `Check details and publish ${sectionHeading} to the examination library${
			projectName ? ` - ${projectName}` : ''
		} - NSIP applications`,
		sectionHeading,
		backLink,
		publishUrl: formPublishUrl,
		categoryCode: sectionCategoryCode,
		examinationTimetableItemId: item.examinationTimetableItemId,
		totalPublishedCount,
		unpublishedCount,
		totalItemsText: `The ${sectionHeading} category for the examination library will contain references for ${totalPublishedCount} items.`,
		hasUnpublishedItems: unpublishedCount > 0,
		unpublishedInsetText: `${unpublishedCount} items are not yet published and will not be assigned an examination library reference number. The other references have been adjusted to reflect this.`,
		warningText:
			'Once an examination library category has been published, the examination library references are final and cannot be changed.',
		sectionTable
	};
};
