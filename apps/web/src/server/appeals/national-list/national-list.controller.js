import * as nationalListService from './national-list.service.js';

/** @typedef {import('@pins/appeals').Pagination} Pagination */

/**
 * @typedef {object} ViewNationalListRenderOptions
 * @property {object[]} appeals
 * @property {string} userRole
 * @property {Pagination} pagination
 */

/** @type {import('@pins/express').RenderHandler<ViewNationalListRenderOptions>}  */
export const viewNationalList = async (request, response) => {
	const { originalUrl, query } = request;
	const urlWithoutQuery = originalUrl.split('?')[0];

	// pageNumber = 1 by default
	const pageNumber = query?.pageNumber ? Number.parseInt(String(query.pageNumber), 10) : 1;

	const appealsData = await nationalListService.getAppealsByPage(pageNumber);
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
				href: `${urlWithoutQuery}?pageNumber=${pageNumber - 1}`
			};
		}

		if (currentPage < totalPages) {
			pagination.next = {
				href: `${urlWithoutQuery}?pageNumber=${pageNumber + 1}`
			};
		}

		// first index
		pagination.items.push({
			number: 1,
			href: `${urlWithoutQuery}?pageNumber=1`,
			current: currentPage === 1
		});

		// if pages total is less or eq to 10 then display all of them in one row
		// otherwise implement ellipsis logic
		if (totalPages <= 10) {
			for (let pageIndex = 2; pageIndex <= totalPages; pageIndex += 1) {
				pagination.items.push({
					number: pageIndex,
					href: `${urlWithoutQuery}?pageNumber=${pageIndex}`,
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
					href: `${urlWithoutQuery}?pageNumber=${previousPage}`,
					current: false
				});
			}

			if (currentPage > 1) {
				pagination.items.push({
					number: currentPage,
					href: `${urlWithoutQuery}?pageNumber=${currentPage}`,
					current: true
				});
			}

			if (nextPage > 1 && nextPage < totalPages) {
				pagination.items.push({
					number: nextPage,
					href: `${urlWithoutQuery}?pageNumber=${nextPage}`,
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
					href: `${urlWithoutQuery}?pageNumber=${totalPages}`,
					current: currentPage === totalPages
				});
			}
		}
	}
	response.render('appeals/all-appeals/dashboard.njk', {
		userRole: 'Case officer',
		appeals,
		pagination
	});
};
