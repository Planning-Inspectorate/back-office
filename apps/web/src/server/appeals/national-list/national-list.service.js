import { get } from '../../lib/request.js';

/** @typedef {import('@pins/appeals').AppealList} AppealList */

/**
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {Promise<AppealList>}
 */
export const getAppealsByPage = (pageNumber, pageSize = 30) =>
	get(`appeals?pageNumber=${pageNumber}&pageSize=${pageSize}`);
