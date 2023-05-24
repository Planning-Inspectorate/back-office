import { databaseConnector } from '../utils/database-connector.js';
import { getSkipValue } from '../utils/database-pagination.js';

/**
 * List project updates for a particular case
 *
 * @param {number} caseId
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {Promise<{count: number, items: import('@prisma/client').ProjectUpdate[]}>}
 */
export async function listProjectUpdates(caseId, pageNumber, pageSize) {
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
			take: pageSize
		})
	]);

	return {
		count: result[0],
		items: result[1]
	};
}
