import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<{ count: number, items: any[]}>}
 */
export const getByCaseId = async (caseId) => {
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
			take: 25
		})
	]);

	return {
		count,
		items
	};
};
