import { buildTable } from '../../../lib/table-mapper.js';
import { url } from '../../../lib/nunjucks-filters/index.js';

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibrarySection} ExaminationLibrarySection
 */

/**
 *
 * @param {{
 *   caseId: number,
 *   categoryDocuments: Array<any>,
 *   itemSlug: string,
 *   section: ExaminationLibrarySection
 * }} params
 * @returns {object}
 */
export const getExaminationLibraryUnpublishViewModel = ({
	caseId,
	categoryDocuments,
	itemSlug,
	section
}) => {
	const item = section.items.find((item) => item.href === itemSlug);
	const sectionHeading = item?.title || '';
	const backLink = url('examination-library-section', { caseId, slug: itemSlug });

	const unpublishTableData = buildTable({
		headers: ['Reference', 'Document'],
		rows: categoryDocuments.map((document) => {
			if (!document?.latestDocumentVersion || !Object.keys(document.latestDocumentVersion).length) {
				return [];
			}

			const documentReference = document?.latestDocumentVersion?.examinationRefNo || '';
			const documentDescription =
				document?.latestDocumentVersion?.description || 'Missing property';

			const documentPropertiesURL = url('document', {
				caseId: document.caseId,
				folderId: document.folderId,
				documentGuid: document.latestDocumentVersion.documentGuid,
				step: 'properties'
			});

			return [
				{ text: documentReference },
				document.isDeleted
					? { text: 'Document has been deleted' }
					: {
							html: `<a href="${documentPropertiesURL}" class="govuk-link">${documentDescription}</a>`
						}
			];
		}),
		caption: sectionHeading
	});

	const unpublishTable = {
		...unpublishTableData,
		captionClasses: 'govuk-table__caption govuk-table__caption--m'
	};

	return {
		selectedPageType: 'examination-library',
		sectionHeading,
		unpublishTable,
		backLink
	};
};
