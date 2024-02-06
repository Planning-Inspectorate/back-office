import logger from '#lib/logger.js';
import config from '#environment/config.js';
import usersService from '#appeals/appeal-users/users-service.js';
import { nationalListPage } from './national-list.mapper.js';
import { getAppeals } from './national-list.service.js';
import { getPaginationParametersFromQuery } from '#lib/pagination-utilities.js';
import { mapPagination } from '#lib/mappers/pagination.mapper.js';

/** @typedef {import('@pins/appeals').Pagination} Pagination */

//This is a test functions to check user permissions on AD
export const getCaseOfficers = async (
	/** @type {{ session: import("../../app/auth/auth-session.service.js").SessionWithAuth; }} */
	request,
	/** @type {{ json: (arg0: { id: string; name: string; email: string; }[]) => void; }} */
	response
) => {
	const caseOfficers = await usersService.getUsersByRole(
		config.referenceData.appeals.caseOfficerGroupId,
		request.session
	);
	response.json(caseOfficers);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const viewNationalList = async (request, response) => {
	const { originalUrl, query } = request;

	const appealStatusFilter = query.appealStatusFilter && String(query.appealStatusFilter);
	const inspectorStatusFilter = query.inspectorStatusFilter && String(query.inspectorStatusFilter);
	let searchTerm = query?.searchTerm ? String(query.searchTerm).trim() : '';
	let searchTermError = '';

	if (searchTerm && searchTerm.length && (searchTerm.length === 1 || searchTerm.length >= 9)) {
		searchTerm = '';
		searchTermError = 'Search query must be between 2 and 8 characters';
	}

	const urlWithoutQuery = originalUrl.split('?')[0];
	const paginationParameters = getPaginationParametersFromQuery(query);
	const appeals = await getAppeals(
		request.apiClient,
		searchTerm,
		appealStatusFilter,
		inspectorStatusFilter,
		paginationParameters.pageNumber,
		paginationParameters.pageSize
	).catch((error) => logger.error(error));

	if (!appeals) {
		return response.status(404).render('app/404');
	}

	const mappedPageContent = nationalListPage(
		appeals,
		urlWithoutQuery,
		searchTerm,
		searchTermError,
		appealStatusFilter,
		inspectorStatusFilter
	);

	const pagination = mapPagination(
		appeals.page,
		appeals.pageCount,
		appeals.pageSize,
		urlWithoutQuery,
		query
	);

	return response.render('patterns/display-page.pattern.njk', {
		pageContent: mappedPageContent,
		pagination
	});
};
