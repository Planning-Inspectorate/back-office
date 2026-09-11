import { examinationLibrarySections } from './examination-library.constants.js';
import { getStatusDisplayName } from '@pins/applications/lib/status-utils.js';
import { buildTable } from '../../../lib/table-mapper.js';
import { statusName } from '../../../lib/nunjucks-filters/status-name.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import {
	getDocumentDescriptionHTML,
	getSectionByItemSlug
} from './applications-examination-library-utils.js';

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
 * Get Examination Library section detail view model.
 *
 * @param {{
 *   dynamicSections?: ExaminationLibraryDynamicSection[],
 *   sectionDocuments: Array<any>,
 *   sectionStatus: import('@pins/applications/lib/status-utils.js').ApplicationStatus,
 *   itemSlug: string
 * }} params
 * @returns {{ selectedPageType: string, sectionHeading: string, sectionStatus: string, sectionTable: object } | null}
 */
export const getExaminationLibrarySectionViewModel = ({
	dynamicSections = [],
	sectionDocuments,
	sectionStatus,
	itemSlug
}) => {
	const section = getSectionByItemSlug(examinationLibrarySections, dynamicSections, itemSlug);

	if (!section) {
		return null;
	}

	const item = section.items.find((item) => item.href === itemSlug);

	if (!item) {
		return null;
	}

	const sectionTableData = buildTable({
		headers: section.tableHeaders,
		rows: sectionDocuments.map((sectionDocument) => {
			const includeAuthor = section.tableHeaders.includes('From');
			const documentIsDeleted = sectionDocument.isDeleted;
			const documentDescriptionHTML = getDocumentDescriptionHTML(sectionDocument);

			const documentPropertiesURL = url('document', {
				caseId: sectionDocument.caseId,
				folderId: sectionDocument.folderId,
				documentGuid: sectionDocument.latestDocumentVersion.documentGuid,
				step: 'properties'
			});

			// Reference column is not populated as references cannot be assigned yet
			const tableRows = [
				{ text: '' },
				{ html: documentDescriptionHTML },
				...(includeAuthor ? [{ text: sectionDocument.latestDocumentVersion.author }] : []),
				{ text: statusName(sectionDocument.latestDocumentVersion.publishedStatus) },
				{ html: `<a href="${documentPropertiesURL}" class="govuk-link">Review</a>` }
			];

			if (documentIsDeleted) {
				return [
					{ text: '' },
					{ text: 'Document has been deleted' },
					...Array(section.tableHeaders.length - 2).fill({ text: '' })
				];
			}

			return tableRows;
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
		sectionStatus: getStatusDisplayName(sectionStatus),
		sectionTable: sectionTable
	};
};
