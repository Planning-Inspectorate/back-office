import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @param {{page: number, pageSize: number}} pagination
 * @param {{searchTerm: string?, filters: Record<string, string[] | boolean>?, sort: object[]?}} filterAndSort
 * @returns {Promise<{count: number, items: any[]}>}
 */
export const getByCaseId = async (caseId, { page, pageSize }, { searchTerm, filters, sort }) => {
	const where = {
		caseId,
		...(searchTerm ? buildSearch(searchTerm) : {}),
		...(filters ? buildFilters(filters) : {})
	};

	const orderBy = buildOrderBy(sort);

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
			orderBy
		})
	]);

	return {
		count,
		items
	};
};

/**
 *
 * @param {number} id
 * @param {number?} caseId
 * @returns {Promise<any>}
 */
export const getById = async (id, caseId) => {
	let caseFilter = {};

	if (caseId) {
		caseFilter = {
			case: {
				id: caseId
			}
		};
	}

	const representations = await databaseConnector.representation.findMany({
		select: {
			id: true,
			reference: true,
			status: true,
			redacted: true,
			received: true,
			originalRepresentation: true,
			redactedRepresentation: true,
			user: {
				select: {
					azureReference: true
				}
			},
			contacts: {
				select: {
					type: true,
					firstName: true,
					lastName: true,
					organisationName: true,
					jobTitle: true,
					under18: true,
					email: true,
					phoneNumber: true,
					address: {
						select: {
							addressLine1: true,
							addressLine2: true,
							town: true,
							county: true,
							postcode: true
						}
					}
				}
			},
			attachments: {
				select: {
					documentVersion: {
						select: {
							fileName: true,
							mime: true,
							path: true
						},
						take: 1,
						orderBy: {
							lastModified: 'desc'
						}
					}
				},
				where: {
					isDeleted: false
				}
			}
		},
		where: {
			id,
			...caseFilter
		}
	});

	const representation = representations[0];

	if (representation === null || typeof representation === 'undefined') {
		throw new Error('Unknown representation on application');
	}

	return representations[0];
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

/**
 *
 * @param {Record<string, string[] | boolean>} filters
 * @returns {any}
 */
function buildFilters(filters = {}) {
	return {
		AND: Object.entries(filters).map(([name, values]) => {
			if (Array.isArray(values)) {
				return {
					[name]: {
						in: values
					}
				};
			}

			if (name === 'under18') {
				return {
					contacts: {
						some: {
							NOT: {
								type: 'AGENT'
							},
							under18: values
						}
					}
				};
			}

			return {
				[name]: values
			};
		})
	};
}

/**
 *
 * @param {object[]?} sort
 * @returns {object[]}
 */
function buildOrderBy(sort) {
	const primarySort = sort || [{ status: 'asc' }];
	const secondarySort =
		sort && sort.some((sortObject) => Object.keys(sortObject)[0] === 'received')
			? []
			: [{ received: 'asc' }];

	return [...primarySort, ...secondarySort, { id: 'asc' }];
}
