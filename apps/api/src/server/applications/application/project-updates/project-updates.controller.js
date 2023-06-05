import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../constants.js';
import { listProjectUpdates } from '../../../repositories/project-update.respository.js';
import { getPageCount } from '../../../utils/database-pagination.js';
import { mapProjectUpdate } from './project-updates.mapper.js';
import logger from '../../../utils/logger.js';

/**
 * @type {import('express').RequestHandler}
 */
export async function getProjectUpdates(req, res) {
	const page = Number(req.query.page) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;
	const caseId = parseInt(req.params.id);
	logger.debug({ caseId, page, pageSize }, 'getProjectUpdates');
	let orderBy;

	if (req.query.sortBy) {
		const direction = String(req.query.sortBy).startsWith('+') ? 'asc' : 'desc';
		const field = String(req.query.sortBy).substring(1);
		orderBy = {
			[field]: direction
		};
	}

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
