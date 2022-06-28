import { databaseConnector } from '../utils/database-connector.js';

export const getAll = () => {
	return databaseConnector.region.findMany();
};
