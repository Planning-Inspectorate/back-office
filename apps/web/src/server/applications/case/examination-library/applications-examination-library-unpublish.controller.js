// @ts-nocheck

import {
	getCategoryCode,
	getDocumentDescriptionHTML,
	getSectionByItemSlug
} from './applications-examination-library-utils.js';
import { categoryCodes, examinationLibrarySections } from './examination-library.constants.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import { buildTable } from '../../../lib/table-mapper.js';
import { getExaminationLibraryDocumentsByCategory } from './applications-examination-library.service.js';
import { buildQueryString } from '../../common/components/build-query-string.js';

export async function getExaminationLibraryUnpublish(req, res) {
	const { caseId, slug: itemSlug } = req.params;
	const { sortBy, pageSize = 25, page = 1 } = req.query;
	const pageNumber = Number(page) || 1;
	const pageSizeNumber = Number(pageSize) || 25;

	const section = getSectionByItemSlug(examinationLibrarySections, itemSlug);
	const sectionCategoryCode = section ? getCategoryCode(section, categoryCodes) : '';

	if (!section || !sectionCategoryCode) {
		return res.status(404).render('app/404');
	}

	const item = section.items.find((item) => item.href === itemSlug);
	const sectionHeading = item?.title || '';
	const backLink = url('examination-library-section', { caseId, slug: itemSlug });

	const queryString = buildQueryString({
		sortBy,
		pageSize: pageSizeNumber,
		page: pageNumber
	});

	const categoryDocuments = await getExaminationLibraryDocumentsByCategory(
		caseId,
		sectionCategoryCode,
		queryString
	);

	const filteredCategoryDocuments = categoryDocuments.items.filter((document) => {
		return !!document?.latestDocumentVersion?.examinationRefNo;
	});

	const tableHeaders = ['Reference', 'Document'];
	const unpublishTableData = buildTable({
		headers: tableHeaders,
		rows: filteredCategoryDocuments.map((document) => {
			if (!document?.latestDocumentVersion || !Object.keys(document.latestDocumentVersion).length) {
				return [];
			}

			const documentIsDeleted = document.isDeleted;
			const documentReference = document.latestDocumentVersion.examinationRefNo;

			if (documentIsDeleted) {
				return [{ text: documentReference }, { text: 'Document has been deleted' }];
			}

			const tableRow = [
				{ text: documentReference },
				{ html: getDocumentDescriptionHTML(document) }
			];

			return tableRow;
		}),
		caption: ''
	});

	const unpublishTable = {
		...unpublishTableData,
		captionClasses: ''
	};

	return res.render('applications/case-examination-library/examination-library-unpublish.njk', {
		sectionHeading,
		backLink,
		unpublishTable
	});
}

export function postExaminationLibraryUnpublish() {}
