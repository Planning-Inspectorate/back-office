import { databaseConnector } from '../utils/database-connector.js';
import { getSkipValue } from '../utils/database-pagination.js';

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
 * @returns {Promise<import('@prisma/client').Prisma.ProjectUpdateGetPayload<{include: {case: true}}>>}
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
