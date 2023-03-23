import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @param {{page: number, pageSize: number}} pagination
 * @param {string?} searchTerm
 * @returns {Promise<{count: number, items: any[]}>}
 */
export const getByCaseId = async (caseId, { page, pageSize }, searchTerm) => {
	const where = {
		caseId,
		...(searchTerm ? buildSearch(searchTerm) : {})
	};

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

/**
 *
 * @param {string} searchTerm
 * @returns {any}
 */
function buildSearch(searchTerm) {
	return {
		OR: [
			{
				reference: {
					contains: searchTerm
				}
			},
			{
				originalRepresentation: {
					contains: searchTerm
				}
			},
			{
				contacts: {
					some: {
						// Exclude agent contact from search
						NOT: {
							type: 'AGENT'
						},
						OR: [
							{
								organisationName: {
									contains: searchTerm
								}
							},
							{
								firstName: {
									contains: searchTerm
								}
							},
							{
								lastName: {
									contains: searchTerm
								}
							}
						]
					}
				}
			}
		]
	};
}
