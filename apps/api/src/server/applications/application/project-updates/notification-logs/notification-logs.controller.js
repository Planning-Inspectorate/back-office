import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../constants.js';
import * as repository from '../../../../repositories/project-update.respository.js';
import { getPageCount } from '#utils/database-pagination.js';
import logger from '../../../../utils/logger.js';

/**
 * @type {import('express').RequestHandler}
 */
export async function getNotificationLogs(req, res) {
	/**
	 * @type {import('../../../../repositories/project-update.respository.js').PaginationOptions & {projectUpdateId: number}}
	 */
	const opts = {
		page: Number(req.query.page) || DEFAULT_PAGE_NUMBER,
		pageSize: Number(req.query.pageSize) || DEFAULT_PAGE_SIZE,
		projectUpdateId: Number(req.params.projectUpdateId)
	};
	logger.debug(opts, 'getNotificationLogs');

	const result = await repository.listNotificationLogs(opts);

	res.send({
		itemCount: result.count,
		items: result.items,
		page: opts.page,
		pageCount: getPageCount(result.count, opts.pageSize),
		pageSize: opts.pageSize
	});
}

/**
 * @type {import('express').RequestHandler}
 */
export async function postNotificationLogs(req, res) {
	logger.debug('postNotificationLogs');
	const count = await repository.createNotificationLogs(req.body);
	res.send(count);
}
