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
 * @param {string} searchCriteria
 * @param {string} pageNumber
 * @param {string} pageSize
 * @returns {Promise<import('@pins/api').Schema.Application[]>}
 */
 export const getBySearchCriteria = (searchCriteria, pageNumber, pageSize) => {
	return databaseConnector.application.findMany({
		where: {
			searchCriteria,
			pageNumber,
			pageSize
		},
		include: {
			reference: true
		}
	});
};
