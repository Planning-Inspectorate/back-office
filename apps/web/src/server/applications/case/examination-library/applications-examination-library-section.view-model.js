import {
	examinationLibrarySections,
	getCategoryStatusDisplayName
} from './examination-library.constants.js';
import { buildTable } from '../../../lib/table-mapper.js';
import { statusName } from '../../../lib/nunjucks-filters/status-name.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import {
	getDocumentDescriptionHTML,
	getSectionByItemSlug
} from './applications-examination-library-utils.js';
import { tableSortLinks } from './applications-examination-library-utils.js';

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibraryItem} ExaminationLibraryItem
 */

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibrarySection} ExaminationLibrarySection
 */

/**
 * Get Examination Library section detail view model.
 *
 * @param {{
 *   sectionDocuments: Array<any>,
 *   sectionStatus: string,
 *   itemSlug: string,
 *   query: object,
 *   sectionUrl: string
 * }} params
 * @returns {{ selectedPageType: string, sectionHeading: string, sectionStatus: string, sectionTable: object, sortLinks: object } | null}
 */
export const getExaminationLibrarySectionViewModel = ({
	sectionDocuments,
	sectionStatus,
	itemSlug,
	query,
	sectionUrl
}) => {
	const section = getSectionByItemSlug(examinationLibrarySections, itemSlug);

	if (!section) {
		return null;
	}

	const isPublished = sectionStatus === 'published';

	// TODO: Table header "Status" should be renamed to "Document status" to distinguish from category status
	const tableHeaders = section.tableHeaders.map((header) =>
		header === 'Reference' && !isPublished ? 'Draft reference' : header
	);

	const sortLinks = tableSortLinks(query, tableHeaders, sectionUrl, isPublished);

	const item = section.items.find((item) => item.href === itemSlug);

	if (!item) {
		return null;
	}

	const sectionTableData = buildTable({
		headers: tableHeaders,
		rows: sectionDocuments.map((sectionDocument) => {
			if (
				!sectionDocument?.latestDocumentVersion ||
				!Object.keys(sectionDocument.latestDocumentVersion).length
			) {
				return [];
			}

			const includeAuthor = tableHeaders.includes('From');
			const documentIsDeleted = sectionDocument.isDeleted;

			const documentReference =
				sectionDocument.latestDocumentVersion.examinationRefNo ??
				sectionDocument.latestDocumentVersion.draftExaminationLibraryReference ??
				'';

			if (documentIsDeleted) {
				return [
					{ text: documentReference },
					{ text: 'Document has been deleted' },
					...Array(tableHeaders.length - 2).fill({ text: '' })
				];
			}

			const documentPropertiesURL = url('document', {
				caseId: sectionDocument.caseId,
				folderId: sectionDocument.folderId,
				documentGuid: sectionDocument.latestDocumentVersion.documentGuid,
				step: 'properties'
			});

			const tableRow = [
				{ text: documentReference },
				{ html: getDocumentDescriptionHTML(sectionDocument) },
				...(includeAuthor ? [{ text: sectionDocument.latestDocumentVersion.author }] : []),
				{ text: statusName(sectionDocument.latestDocumentVersion.publishedStatus) },
				{ text: 'Review', href: documentPropertiesURL }
			];

			return tableRow;
		}),
		caption: 'Items in the examination library'
	});

	const sectionTable = {
		...sectionTableData,
		captionClasses: 'govuk-table__caption govuk-table__caption--m'
	};

	return {
		selectedPageType: 'examination-library',
		sectionHeading: item.title,
		sectionStatus: getCategoryStatusDisplayName(sectionStatus),
		sectionTable: sectionTable,
		sortLinks: sortLinks
	};
};
