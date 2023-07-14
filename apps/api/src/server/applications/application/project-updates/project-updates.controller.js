import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../constants.js';
import * as repository from '../../../repositories/project-update.respository.js';
import { getPageCount } from '../../../utils/database-pagination.js';
import { mapProjectUpdate } from './project-updates.mapper.js';
import logger from '../../../utils/logger.js';
import { sortByFromQuery } from '../../../utils/query/sort-by.js';
import {
	createProjectUpdateService,
	updateProjectUpdateService
} from './project-updates.service.js';
import { NotFound } from '#utils/api-errors.js';

/**
 * @type {import('express').RequestHandler}
 */
export async function getProjectUpdates(req, res) {
	const page = Number(req.query.page) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;
	const caseId = parseInt(req.params.id);
	const orderBy = sortByFromQuery(req.query.sortBy);
	logger.debug({ caseId, page, pageSize, orderBy }, 'getProjectUpdates');

	const result = await repository.listProjectUpdates(caseId, page, pageSize, orderBy);
	const formattedItems = result.items.map(mapProjectUpdate);

	res.send({
		itemCount: result.count,
		items: formattedItems,
		page: page,
		pageCount: getPageCount(result.count, pageSize),
		pageSize
	});
}

/**
 * @type {import('express').RequestHandler}
 */
export async function postProjectUpdate(req, res) {
	const caseId = parseInt(req.params.id);
	logger.debug({ body: req.body, caseId }, 'postProjectUpdate');
	const update = await createProjectUpdateService(req.body, caseId);
	res.send(update);
}

/**
 * @type {import('express').RequestHandler}
 */
export async function getProjectUpdate(req, res) {
	const caseId = parseInt(req.params.id);
	const projectUpdateId = parseInt(req.params.projectUpdateId);
	logger.debug({ caseId, projectUpdateId }, 'getProjectUpdate');

	const result = await repository.getProjectUpdate(projectUpdateId);
	// don't allow invalid requests where the project update is for another case
	if (result === null || result.caseId !== caseId) {
		res.status(404).send(NotFound);
	} else {
		res.send(mapProjectUpdate(result));
	}
}

/**
 * @type {import('express').RequestHandler}
 */
export async function patchProjectUpdate(req, res) {
	const caseId = parseInt(req.params.id);
	const projectUpdateId = parseInt(req.params.projectUpdateId);
	logger.debug({ body: req.body, caseId, projectUpdateId }, 'patchProjectUpdate');
	const update = await updateProjectUpdateService(req.body, projectUpdateId);
	res.send(update);
}
