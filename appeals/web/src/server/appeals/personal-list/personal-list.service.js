import { paginationDefaultSettings } from '../appeal.constants.js';

/** @typedef {import('@pins/appeals').AppealList} AppealList */

/**
 * @param {import('got').Got} apiClient
 * @param {string|undefined} appealStatusFilter
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {Promise<AppealList>}
 */
export const getAppealsAssignedToCurrentUser = (
	apiClient,
	appealStatusFilter,
	pageNumber = paginationDefaultSettings.firstPageNumber,
	pageSize = paginationDefaultSettings.pageSize
) => {
	let urlAppendix = '';

	if (appealStatusFilter && appealStatusFilter !== 'all') {
		urlAppendix = `&status=${appealStatusFilter}`;
	}

	return apiClient
		.get(`appeals/my-appeals?pageNumber=${pageNumber}&pageSize=${pageSize}${urlAppendix}`)
		.json();
};
