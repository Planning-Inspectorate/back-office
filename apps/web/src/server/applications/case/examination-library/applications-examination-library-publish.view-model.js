import { examinationLibrarySections, categoryCodes } from './examination-library.constants.js';
import { buildTable } from '../../../lib/table-mapper.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import { getSectionByItemSlug, getCategoryCode } from './applications-examination-library-utils.js';

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibrarySection} ExaminationLibrarySection
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibrarySectionDocument} ExaminationLibrarySectionDocument
 */

/**
 * Get Examination Library check details and publish view model.
 *
 * @param {{
 *   section?: ExaminationLibrarySection,
 *   sectionDocuments: Array<any>,
 *   totalPublishedCount: number,
 *   unpublishedCount: number,
 *   itemSlug: string,
 *   caseId: number,
 *   publishUrl?: string,
 *   isUpdate?: boolean,
 *   additionalCount?: number
 * }} params
 * @returns {object | null}
 */
export const getExaminationLibraryPublishViewModel = ({
	section,
	sectionDocuments = [],
	totalPublishedCount = 0,
	unpublishedCount = 0,
	itemSlug,
	caseId,
	publishUrl,
	isUpdate = false,
	additionalCount = 0
}) => {
	const resolvedSection = section || getSectionByItemSlug(examinationLibrarySections, itemSlug);

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
		publishUrl ||
		url(isUpdate ? 'examination-library-update' : 'examination-library-publish', {
			caseId,
			slug: itemSlug
		});

	const tableRows = sectionDocuments.map((sectionDocument) => {
		if (
			!sectionDocument?.latestDocumentVersion ||
			!Object.keys(sectionDocument.latestDocumentVersion).length
		) {
			return [];
		}

		const ref =
			sectionDocument.latestDocumentVersion.examinationRefNo ||
			sectionDocument.latestDocumentVersion.draftExaminationLibraryReference ||
			'';
		const refCell = { text: ref };

		if (sectionDocument.isDeleted) {
			return [refCell, { text: 'Document has been deleted' }, { text: '' }];
		}

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
			text: docName,
			href: documentPropertiesURL
		};

		const author = sectionDocument.latestDocumentVersion.author || '';
		const fromCell = { text: author };

		return [refCell, documentCell, fromCell];
	});

	const sectionTableData = buildTable({
		headers: tableHeaders,
		rows: tableRows,
		caption: sectionHeading,
		firstCellIsHeader: true
	});

	const sectionTable = {
		...sectionTableData,
		captionClasses: 'govuk-visually-hidden'
	};

	const sectionCategoryCode = getCategoryCode(resolvedSection, categoryCodes);

	return {
		selectedPageType: 'examination-library',
		isUpdate,
		sectionHeading,
		backLink,
		publishUrl: formPublishUrl,
		categoryCode: sectionCategoryCode,
		totalPublishedCount,
		unpublishedCount,
		additionalCount,
		totalItemsText: `The ${sectionHeading} category for the examination library will contain references for ${totalPublishedCount} items.`,
		hasUnpublishedItems: unpublishedCount > 0,
		unpublishedInsetText: `${unpublishedCount} items are not yet published and will not be assigned an examination library reference number. The other references have been adjusted to reflect this.`,
		hasAdditionalItems: additionalCount > 0,
		additionalItemsText: `${additionalCount} items on this page will be added to the library.`,
		warningText:
			'Once an examination library category has been published, the examination library references are final and cannot be changed.',
		sectionTable
	};
};
