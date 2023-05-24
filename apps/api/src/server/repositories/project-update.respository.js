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
