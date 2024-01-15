import logger from '#lib/logger.js';
import { personalListPage } from './personal-list.mapper.js';
import { getAppealsAssignedToCurrentUser } from './personal-list.service.js';
import { getPaginationParametersFromQuery } from '#lib/pagination-utilities.js';
import { mapPagination } from '#lib/mappers/pagination.mapper.js';

/** @typedef {import('@pins/appeals').Pagination} Pagination */

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const viewPersonalList = async (request, response) => {
	const { originalUrl, query } = request;

	const urlWithoutQuery = originalUrl.split('?')[0];
	const paginationParameters = getPaginationParametersFromQuery(query);
	const assignedAppeals = await getAppealsAssignedToCurrentUser(
		request.apiClient,
		paginationParameters.pageNumber,
		paginationParameters.pageSize
	).catch((error) => logger.error(error));

	if (!assignedAppeals) {
		return response.status(404).render('app/404');
	}

	const mappedPageContent = personalListPage(assignedAppeals, request.session);
	const pagination = mapPagination(
		assignedAppeals.page,
		assignedAppeals.pageCount,
		assignedAppeals.pageSize,
		urlWithoutQuery
	);

	return response.render('patterns/display-page.pattern.njk', {
		pageContent: mappedPageContent,
		pagination
	});
};
