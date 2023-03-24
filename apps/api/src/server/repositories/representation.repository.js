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
				redacted: true,
				received: true,
				contacts: {
					select: {
						firstName: true,
						lastName: true,
						organisationName: true
					},
					where: {
						NOT: {
							type: 'AGENT'
						}
					}
				}
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
 * @param {string} rawSearchTerm
 * @returns {any}
 */
function buildSearch(rawSearchTerm) {
	const searchTerm = rawSearchTerm.replace(/\s+/, ' ');

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
							...buildSplitContains('firstName', searchTerm),
							...buildSplitContains('lastName', searchTerm)
						]
					}
				}
			}
		]
	};
}

/**
 *
 * @param {string} field
 * @param {string} searchTerm
 * @returns {any}
 */
function buildSplitContains(field, searchTerm = '') {
	const terms = searchTerm.split(/\s+/);

	return terms.map((term) => ({
		[field]: {
			contains: term
		}
	}));
}
