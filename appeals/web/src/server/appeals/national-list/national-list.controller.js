import { paginationDefaultSettings } from '../appeal.constants.js';
import * as nationalListService from './national-list.service.js';

/** @typedef {import('@pins/appeals').Pagination} Pagination */
/** @typedef {import('@pins/appeals').SearchInputFieldObject} SearchInputFieldObject */

/**
 * @typedef {object} ViewNationalListRenderOptions
 * @property {object[]} appeals
 * @property {string} userRole
 * @property {Pagination} pagination
 * @property {object} searchObject
 * @property {string} searchTerm
 * @property {string} nationalListHeading
 */

/** @type {import('@pins/express').RenderHandler<ViewNationalListRenderOptions>}  */
export const viewNationalList = async (request, response) => {
	const { originalUrl, query } = request;
	const urlWithoutQuery = originalUrl.split('?')[0];

	// defaults
	const pageNumber = query?.pageNumber
		? Number.parseInt(String(query.pageNumber), 10)
		: paginationDefaultSettings.firstPageNumber;
	const pageSize = query?.pageSize
		? Number.parseInt(String(query.pageSize), 10)
		: paginationDefaultSettings.pageSize;

	let searchTerm = query?.searchTerm ? String(query.searchTerm).trim() : '';

	/** @type {SearchInputFieldObject} */
	const searchObject = {
		id: 'searchTerm',
		name: 'searchTerm',
		label: {
			text: 'Enter appeal ID or postcode',
			classes: 'govuk-caption-m govuk-!-margin-bottom-3 colour--secondary'
		}
	};

	if (searchTerm.length === 1 || searchTerm.length >= 9) {
		searchTerm = '';
		searchObject.errorMessage = {
			text: 'Search query must be between 2 and 8 characters'
		};
	} else {
		searchObject.value = searchTerm;
	}

	const searchParam = searchTerm ? `&searchTerm=${searchTerm}` : '';
	const nationalListHeading = searchTerm ? 'Search results' : 'All cases';

	const appealsData = await nationalListService.getAppealsByPage(
		request.apiClient,
		pageNumber,
		pageSize,
		searchParam
	);

	const { items: appeals, page: currentPage, pageCount: totalPages } = appealsData;

	const previousPage = currentPage - 1;
	const nextPage = currentPage + 1;

	// basic pagination object
	/** @type {Pagination} */
	const pagination = {
		previous: {},
		next: {},
		items: []
	};

	if (totalPages > 1) {
		if (currentPage > 1) {
			pagination.previous = {
				href: `${urlWithoutQuery}?pageSize=${pageSize}&pageNumber=${pageNumber - 1}${searchParam}`
			};
		}

		if (currentPage < totalPages) {
			pagination.next = {
				href: `${urlWithoutQuery}?pageSize=${pageSize}&pageNumber=${pageNumber + 1}${searchParam}`
			};
		}

		// first index
		pagination.items.push({
			number: 1,
			href: `${urlWithoutQuery}?pageSize=${pageSize}&pageNumber=${paginationDefaultSettings.firstPageNumber}${searchParam}`,
			current: currentPage === 1
		});

		// if pages total is less or eq to 10 then display all of them in one row
		// otherwise implement ellipsis logic
		if (totalPages <= 10) {
			for (let pageIndex = 2; pageIndex <= totalPages; pageIndex += 1) {
				pagination.items.push({
					number: pageIndex,
					href: `${urlWithoutQuery}?pageSize=${pageSize}&pageNumber=${pageIndex}${searchParam}`,
					current: currentPage === pageIndex
				});
			}
		} else {
			// do not show this ellipsis if you're in the beginning of the pagination
			pagination.items.push({
				ellipsis: currentPage > 3
			});

			// logic for neighbouring indexes (previous, current and next ones)
			if (previousPage > 1) {
				pagination.items.push({
					number: previousPage,
					href: `${urlWithoutQuery}?pageSize=${pageSize}&pageNumber=${previousPage}${searchParam}`,
					current: false
				});
			}

			if (currentPage > 1) {
				pagination.items.push({
					number: currentPage,
					href: `${urlWithoutQuery}?pageSize=${pageSize}&pageNumber=${currentPage}${searchParam}`,
					current: true
				});
			}

			if (nextPage > 1 && nextPage < totalPages) {
				pagination.items.push({
					number: nextPage,
					href: `${urlWithoutQuery}?pageSize=${pageSize}&pageNumber=${nextPage}${searchParam}`,
					current: false
				});
			}

			// do not show this ellipsis if you're in the end of the pagination
			pagination.items.push({
				ellipsis: currentPage < totalPages - 2
			});

			// last index
			if (currentPage < totalPages) {
				pagination.items.push({
					number: totalPages,
					href: `${urlWithoutQuery}?pageSize=${pageSize}&pageNumber=${totalPages}${searchParam}`,
					current: currentPage === totalPages
				});
			}
		}
	}
	response.render('appeals/all-appeals/dashboard.njk', {
		userRole: 'Case officer',
		appeals,
		pagination,
		searchObject,
		searchTerm,
		nationalListHeading
	});
};
