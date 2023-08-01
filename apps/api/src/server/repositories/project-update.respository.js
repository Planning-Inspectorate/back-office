import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
import { databaseConnector } from '../utils/database-connector.js';
import { getSkipValue } from '../utils/database-pagination.js';
import BackOfficeAppError from '#utils/app-error.js';

/**
 * @typedef {import('@prisma/client').Prisma.ProjectUpdateGetPayload<{include: {case: true}}>} ProjectUpdateWithCase
 */

/**
 * List project updates for a particular case
 *
 * @param {number} caseId
 * @param {number} pageNumber
 * @param {number} pageSize
 * @param {import('@prisma/client').Prisma.ProjectUpdateOrderByWithRelationInput} [orderBy]
 * @returns {Promise<{count: number, items: import('@prisma/client').ProjectUpdate[]}>}
 */
export async function listProjectUpdates(caseId, pageNumber, pageSize, orderBy) {
	const where = {
		caseId
	};

	const result = await databaseConnector.$transaction([
		databaseConnector.projectUpdate.count({
			where
		}),
		databaseConnector.projectUpdate.findMany({
			where,
			skip: getSkipValue(pageNumber, pageSize),
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

export class ProjectUpdateDeleteError extends BackOfficeAppError {}
export class ProjectUpdateStatusError extends BackOfficeAppError {}
