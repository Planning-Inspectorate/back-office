import * as nationalListService from './national-list.service.js';
import config from '#environment/config.js';
import usersService from '#appeals/appeal-users/users-service.js';
import { getPaginationParametersFromQuery } from '#lib/pagination-utilities.js';
import { mapPagination } from '#lib/mappers/pagination.mapper.js';

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

/** @type {import('@pins/express').RenderHandler<ViewNationalListRenderOptions>}  */
export const viewNationalList = async (request, response) => {
	const { originalUrl, query } = request;
	const urlWithoutQuery = originalUrl.split('?')[0];

	const paginationParameters = getPaginationParametersFromQuery(query);

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
		paginationParameters.pageNumber,
		paginationParameters.pageSize,
		searchParam
	);
	const pagination = mapPagination(
		appealsData.page,
		appealsData.pageCount,
		appealsData.pageSize,
		urlWithoutQuery,
		searchParam
	);

	response.render('appeals/all-appeals/dashboard.njk', {
		userRole: 'Case officer',
		appeals: appealsData?.items,
		pagination,
		searchObject,
		searchTerm,
		nationalListHeading
	});
};
