import { paginationDefaultSettings } from '../appeal.constants.js';

/** @typedef {import('@pins/appeals').AppealList} AppealList */

/**
 * @param {import('got').Got} apiClient
 * @param {number} pageNumber
 * @param {number} pageSize
 * @param {string} searchParam
 * @returns {Promise<AppealList>}
 */
export const getAppealsByPage = (
	apiClient,
	pageNumber = paginationDefaultSettings.firstPageNumber,
	pageSize = paginationDefaultSettings.pageSize,
	searchParam = ''
) => apiClient.get(`appeals?pageNumber=${pageNumber}&pageSize=${pageSize}${searchParam}`).json();
