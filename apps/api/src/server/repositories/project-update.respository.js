import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
import { databaseConnector } from '../utils/database-connector.js';
import { getSkipValue } from '../utils/database-pagination.js';
import BackOfficeAppError from '#utils/app-error.js';

/**
 * @typedef {import('@prisma/client').Prisma.ProjectUpdateGetPayload<{include: {case: true}}>} ProjectUpdateWithCase
 */

/**
 * @typedef {Object} PaginationOptions
 * @property {number} page
 * @property {number} pageSize
 */

/**
 * @typedef {Object} ListProjectUpdatesOptions
 * @property {number} page
 * @property {number} pageSize
 * @property {import('@prisma/client').Prisma.ProjectUpdateOrderByWithRelationInput} [orderBy]
 * @property {number} [caseId] - filter option
 * @property {string} [status] - filter option
 * @property {Date} [publishedBefore] - filter option (datePublished < publishedBefore)
 * @property {boolean} [sentToSubscribers] - filter option
 */

/**
 * List project updates for a particular case, with filter options such as by case
 *
 * @param {ListProjectUpdatesOptions} opts
 * @returns {Promise<{count: number, items: import('@prisma/client').ProjectUpdate[]}>}
 */
export async function listProjectUpdates({
	caseId,
	page,
	pageSize,
	orderBy,
	status,
	publishedBefore,
	sentToSubscribers
}) {
	/** @type {import('@prisma/client').Prisma.ProjectUpdateWhereInput} */
	const where = {};
	if (caseId) {
		where.caseId = caseId;
	}
	if (status) {
		where.status = status;
	}
	if (publishedBefore) {
		where.datePublished = { lt: publishedBefore };
	}
	if (sentToSubscribers) {
		where.sentToSubscribers = sentToSubscribers;
	}

	const result = await databaseConnector.$transaction([
		databaseConnector.projectUpdate.count({
			where
		}),
		databaseConnector.projectUpdate.findMany({
			where,
			skip: getSkipValue(page, pageSize),
			take: pageSize,
			orderBy
		})
	]);

	return {
		count: result[0],
		items: result[1]
	};
}

/**
 * Create a new project update
 *
 * @param {import('@prisma/client').Prisma.ProjectUpdateCreateInput} req
 * @returns {Promise<ProjectUpdateWithCase>}
 */
export async function createProjectUpdate(req) {
	return databaseConnector.projectUpdate.create({
		data: req,
		include: {
			// return the related case too
			case: true
		}
	});
}

/**
 * Get a project update
 *
 * @param {number} id
 * @returns {Promise<import('@prisma/client').ProjectUpdate|null>}
 */
export async function getProjectUpdate(id) {
	return databaseConnector.projectUpdate.findUnique({
		where: {
			id
		}
	});
}

/**
 * Update a project update. Verifies the status change is allowed in a transaction.
 *
 * @param {number} id
 * @param {import('@prisma/client').Prisma.ProjectUpdateUpdateInput} req
 * @returns {Promise<ProjectUpdateWithCase>}
 * @throws {BackOfficeAppError}
 */
export async function updateProjectUpdate(id, req) {
	const updateReq = {
		data: req,
		include: {
			// return the related case too
			case: true
		},
		where: {
			id
		}
	};
	if (req.status && typeof req.status === 'string') {
		// run in a transaction to ensure the status change is allowed
		return databaseConnector.$transaction(async (tx) => {
			// read first to get status
			const existing = await tx.projectUpdate.findUnique({ where: { id } });
			const status = existing?.status || ProjectUpdate.Status.draft;

			const allowedStatuses = ProjectUpdate.AllowedStatuses[status];
			// check if new status is allowed
			if (status !== req.status && !allowedStatuses.includes(String(req.status))) {
				throw new ProjectUpdateStatusError(
					`this project update can't be set to ${
						req.status
					}, allowed statuses: ${allowedStatuses.join(', ')}`,
					400
				);
			}

			return await tx.projectUpdate.update(updateReq);
		});
	}
	// if no status change, a simple update will do:
	return databaseConnector.projectUpdate.update(updateReq);
}

/**
 * Update a project update. Verifies the status change is allowed in a transaction.
 *
 * @param {number} id
 * @returns {Promise<ProjectUpdateWithCase>}
 * @throws {BackOfficeAppError}
 */
export async function deleteProjectUpdate(id) {
	const deleteReq = {
		include: {
			case: true
		},
		where: {
			id
		}
	};
	// run in a transaction to ensure the update can be deleted
	return databaseConnector.$transaction(async (tx) => {
		// read first to get status
		const existing = await tx.projectUpdate.findUnique({ where: { id } });
		const status = existing?.status || ProjectUpdate.Status.draft;

		const canBeDeleted = ProjectUpdate.isDeleteable(status);
		// check if new status is allowed
		if (!canBeDeleted) {
			throw new ProjectUpdateDeleteError(`this project update can't be deleted`, 400);
		}

		return await tx.projectUpdate.delete(deleteReq);
	});
}

/**
 * List notification logs
 *
 * @param {PaginationOptions & {projectUpdateId:number}} opts
 * @returns {Promise<{count: number, items: import('@prisma/client').ProjectUpdateNotificationLog[]}>}
 */
export async function listNotificationLogs({ projectUpdateId, page, pageSize }) {
	/** @type {import('@prisma/client').Prisma.ProjectUpdateNotificationLogWhereInput} */
	const where = {
		projectUpdateId
	};

	const result = await databaseConnector.$transaction([
		databaseConnector.projectUpdateNotificationLog.count({
			where
		}),
		databaseConnector.projectUpdateNotificationLog.findMany({
			where,
			skip: getSkipValue(page, pageSize),
			take: pageSize
		})
	]);

	return {
		count: result[0],
		items: result[1]
	};
}

/**
 * Create notification logs
 *
 * @param {import('@prisma/client').Prisma.ProjectUpdateNotificationLogCreateManyInput} logs
 * @returns {Promise<import('@prisma/client').Prisma.BatchPayload>}
 */
export async function createNotificationLogs(logs) {
	return databaseConnector.projectUpdateNotificationLog.createMany({
		data: logs
	});
}

export class ProjectUpdateDeleteError extends BackOfficeAppError {}
export class ProjectUpdateStatusError extends BackOfficeAppError {}
