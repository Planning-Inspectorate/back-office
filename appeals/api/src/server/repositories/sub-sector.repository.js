import { databaseConnector } from '../utils/database-connector.js';

/**
 * @param {{name: string | undefined}} arguments
 * @returns {Promise<import('@pins/appeals.api').Schema.SubSector[]>}
 */
export const getBySector = ({ name }) => {
	return databaseConnector.subSector.findMany({
		where: {
			sector: {
				name
			}
		}
	});
};

/**
 *
 * @param {string} name
 * @returns {Promise<import('@pins/appeals.api').Schema.SubSector | null>}
 */
export const getByName = (name) => {
	return databaseConnector.subSector.findUnique({
		where: {
			name
		}
	});
};
