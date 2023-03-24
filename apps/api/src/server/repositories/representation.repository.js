import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @param {{page: number, pageSize: number}} pagination
 * @returns {Promise<{count: number, items: any[]}>}
 */
export const getByCaseId = async (caseId, { page, pageSize }) => {
	const where = { caseId };

	const [count, items] = await databaseConnector.$transaction([
		databaseConnector.representation.count({
			where
		}),
		databaseConnector.representation.findMany({
			select: {
				id: true,
				reference: true,
				status: true,
				originalRepresentation: true,
				redactedRepresentation: true,
				redacted: true,
				received: true
			},
			where,
			take: pageSize,
			skip: (page - 1) * pageSize,
			orderBy: [{ received: 'desc' }, { id: 'asc' }]
		})
	]);

	return {
		count,
		items
	};
};
