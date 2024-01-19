import { paginationDefaultSettings } from '#appeals/appeal.constants.js';

/** @typedef {import('@pins/appeals').AppealList} AppealList */
/** @typedef {import('@pins/appeals').Pagination} Pagination */

/**
 * @param {number} currentPage
 * @param {number} pageCount
 * @param {number} itemsPerPage
 * @param {string} baseUrl
 * @param {object} query
 * @returns {Pagination}
 */
export function mapPagination(currentPage, pageCount, itemsPerPage, baseUrl, query) {
	// filter out pagination related query params
	const paginationlessQueryParams = Object.entries(query).filter(
		([prop]) => prop !== 'pageNumber' && prop !== 'pageSize'
	);

	// re-construct query params without pagination
	const additionalQueryString = paginationlessQueryParams.reduce(
		(prevValue, [prop, value]) =>
			`${prevValue}&${encodeURIComponent(prop)}=${encodeURIComponent(value)}`,
		''
	);

	/** @type {Pagination} */
	const pagination = {
		previous: {},
		next: {},
		items: []
	};

	if (pageCount > 1) {
		const previousPage = currentPage - 1;
		const nextPage = currentPage + 1;

		if (currentPage > 1) {
			pagination.previous = {
				href: `${baseUrl}?pageSize=${itemsPerPage}&pageNumber=${previousPage}${
					additionalQueryString || ''
				}`
			};
		}

		if (currentPage < pageCount) {
			pagination.next = {
				href: `${baseUrl}?pageSize=${itemsPerPage}&pageNumber=${nextPage}${
					additionalQueryString || ''
				}`
			};
		}

		// first index
		pagination.items.push({
			number: 1,
			href: `${baseUrl}?pageSize=${itemsPerPage}&pageNumber=${
				paginationDefaultSettings.firstPageNumber
			}${additionalQueryString || ''}`,
			current: currentPage === 1
		});

		// if there are 10 or fewer total pages, display pagination links for all of them - otherwise truncate with ellipsis
		if (pageCount <= 10) {
			for (let pageIndex = 2; pageIndex <= pageCount; pageIndex += 1) {
				pagination.items.push({
					number: pageIndex,
					href: `${baseUrl}?pageSize=${itemsPerPage}&pageNumber=${pageIndex}${
						additionalQueryString || ''
					}`,
					current: currentPage === pageIndex
				});
			}
		} else {
			// do not show ellipsis if you're in the beginning of the pagination
			pagination.items.push({
				ellipsis: currentPage > 3
			});

			// logic for neighbouring indexes (previous, current and next ones)
			if (previousPage > 1) {
				pagination.items.push({
					number: previousPage,
					href: `${baseUrl}?pageSize=${itemsPerPage}&pageNumber=${previousPage}${
						additionalQueryString || ''
					}`,
					current: false
				});
			}

			if (currentPage > 1) {
				pagination.items.push({
					number: currentPage,
					href: `${baseUrl}?pageSize=${itemsPerPage}&pageNumber=${currentPage}${
						additionalQueryString || ''
					}`,
					current: true
				});
			}

			if (nextPage > 1 && nextPage < pageCount) {
				pagination.items.push({
					number: nextPage,
					href: `${baseUrl}?pageSize=${itemsPerPage}&pageNumber=${nextPage}${
						additionalQueryString || ''
					}`,
					current: false
				});
			}

			// do not show this ellipsis if you're in the end of the pagination
			pagination.items.push({
				ellipsis: currentPage < pageCount - 2
			});

			// last index
			if (currentPage < pageCount) {
				pagination.items.push({
					number: pageCount,
					href: `${baseUrl}?pageSize=${itemsPerPage}&pageNumber=${pageCount}${
						additionalQueryString || ''
					}`,
					current: currentPage === pageCount
				});
			}
		}
	}

	return pagination;
}
