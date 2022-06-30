import { databaseConnector } from '../utils/database-connector.js';

/**
 * @param {{name: string | undefined}} arguments
 * @returns {Promise<import('@pins/api').Schema.SubSector[]>}
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
