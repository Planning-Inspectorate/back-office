import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../constants.js';
import * as repository from '../../../repositories/project-update.respository.js';
import { getPageCount } from '../../../utils/database-pagination.js';
import { UnsafeContentError, mapProjectUpdate } from './project-updates.mapper.js';
import logger from '../../../utils/logger.js';
import { sortByFromQuery } from '../../../utils/query/sort-by.js';
import {
	createProjectUpdateService,
	deleteProjectUpdateService,
	updateProjectUpdateService
} from './project-updates.service.js';
import { NotFound } from '#utils/api-errors.js';
import { ProjectUpdateStatusError } from '#repositories/project-update.respository.js';

/**
 * @type {import('express').RequestHandler}
 */
export async function getProjectUpdates(req, res) {
	/**
	 * @type {import('../../../repositories/project-update.respository.js').ListProjectUpdatesOptions}
	 */
	const opts = {
		page: Number(req.query.page) || DEFAULT_PAGE_NUMBER,
		pageSize: Number(req.query.pageSize) || DEFAULT_PAGE_SIZE
	};

	// check filters
	if (req.query.status) {
		opts.status = String(req.query.status);
	}
	if (req.query.publishedBefore && typeof req.query.publishedBefore === 'string') {
		opts.publishedBefore = new Date(req.query.publishedBefore);
	}
	if (req.query.sentToSubscribers) {
		opts.sentToSubscribers = Boolean(req.query.sentToSubscribers);
	}
	logger.debug(opts, 'getProjectUpdates');

	const result = await repository.listProjectUpdates(opts);
	const formattedItems = result.items.map(mapProjectUpdate);

	res.send({
		itemCount: result.count,
		items: formattedItems,
		page: opts.page,
		pageCount: getPageCount(result.count, opts.pageSize),
		pageSize: opts.pageSize
	});
}

/**
 * @type {import('express').RequestHandler}
 */
export async function getProjectUpdatesForCase(req, res) {
	const page = Number(req.query.page) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;
	const caseId = parseInt(req.params.id);
	const orderBy = sortByFromQuery(req.query.sortBy);
	logger.debug({ caseId, page, pageSize, orderBy }, 'getProjectUpdatesForCase');

	const result = await repository.listProjectUpdates({ caseId, page, pageSize, orderBy });
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
	// don't allow invalid requests where the project update is for another case, if specified
	if (result === null || (!isNaN(caseId) && result.caseId !== caseId)) {
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
	try {
		const update = await updateProjectUpdateService(req.body, projectUpdateId);
		res.send(update);
	} catch (e) {
		// handle status errors from the db transaction
		if (e instanceof ProjectUpdateStatusError) {
			res.status(400).send({ errors: { status: e.message } });
		} else if (e instanceof UnsafeContentError) {
			res.status(500).send({ errors: { content: e.message } });
		} else {
			throw e;
		}
	}
}

/**
 * @type {import('express').RequestHandler}
 */
export async function deleteProjectUpdate(req, res) {
	const caseId = parseInt(req.params.id);
	const projectUpdateId = parseInt(req.params.projectUpdateId);
	logger.debug({ body: req.body, caseId, projectUpdateId }, 'deleteProjectUpdate');
	try {
		const update = await deleteProjectUpdateService(projectUpdateId);
		res.status(204).send(update);
	} catch (e) {
		// handle status errors from the db transaction
		if (e instanceof repository.ProjectUpdateDeleteError) {
			res.status(400).send({ errors: { message: e.message } });
		} else {
			throw e;
		}
	}
}
