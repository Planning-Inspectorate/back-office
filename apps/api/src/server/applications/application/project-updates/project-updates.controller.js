import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../constants.js';
import { listProjectUpdates } from '../../../repositories/project-update.respository.js';
import { getPageCount } from '../../../utils/database-pagination.js';
import { mapProjectUpdate } from './project-updates.mapper.js';
import logger from '../../../utils/logger.js';
import { sortByFromQuery } from '../../../utils/query/sort-by.js';

/**
 * @type {import('express').RequestHandler}
 */
export async function getProjectUpdates(req, res) {
	const page = Number(req.query.page) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;
	const caseId = parseInt(req.params.id);
	const orderBy = sortByFromQuery(req.query.sortBy);
	logger.debug({ caseId, page, pageSize, orderBy }, 'getProjectUpdates');

	const result = await listProjectUpdates(caseId, page, pageSize, orderBy);
	const formattedItems = result.items.map(mapProjectUpdate);

	res.send({
		itemCount: result.count,
		items: formattedItems,
		page: page,
		pageCount: getPageCount(result.count, pageSize),
		pageSize
	});
}
