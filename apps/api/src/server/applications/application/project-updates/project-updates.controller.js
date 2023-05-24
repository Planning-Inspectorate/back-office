import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../constants.js';
import { listProjectUpdates } from '../../../repositories/project-update.respository.js';
import { getPageCount } from '../../../utils/database-pagination.js';
import { mapProjectUpdate } from './project-updates.mapper.js';
import logger from '../../../utils/logger.js';

/**
 * @type {import('express').RequestHandler}
 */
export async function getProjectUpdates(req, res) {
	const pageNumber = Number(req.query.pageNumber) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;
	const caseId = parseInt(req.params.id);
	logger.debug({ caseId, pageNumber, pageSize }, 'getProjectUpdates');

	const result = await listProjectUpdates(caseId, pageNumber, pageSize);
	const formattedItems = result.items.map(mapProjectUpdate);

	res.send({
		itemCount: result.count,
		items: formattedItems,
		page: pageNumber,
		pageCount: getPageCount(result.count, pageSize),
		pageSize
	});
}
