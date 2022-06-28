import { databaseConnector } from '../utils/database-connector.js';

/**
 * @param {string} status
 * @returns {Promise<import('@pins/api').Schema.Application[]>}
 */
export const getByStatus = (status) => {
	return databaseConnector.application.findMany({
		where: {
			status
		},
		include: {
			subSector: {
				include: {
					sector: true
				}
			}
		}
	});
};

/**
 * @param {string} query
 * @returns {Promise<import('@pins/api').Schema.Application[]>}
 */
export const getBySearchCriteria = (query) => {
	return databaseConnector.application.findMany({
		where: {
			OR: [
				{
					title: { contains: query }
				},
				{
					reference: { contains: query }
				},
				{
					description: { contains: query }
				}
			]
		},
		include: {
			subSector: {
				include: {
					sector: true
				}
			}
		}
	});
};
