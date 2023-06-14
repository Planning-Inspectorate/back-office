import { databaseConnector } from '../server/utils/database-connector.js';

/**
 * Truncates a table in the DB, removing all data.
 * Useful as DeleteMany cannot delete > 2100 rows.
 * Azure MS SQL version
 *
 * @param {string} tableName
 * @returns {Promise<any>}
 */
export const truncateTable = async (tableName) => {
	await databaseConnector.$queryRawUnsafe(`TRUNCATE TABLE "${tableName}";`);
};
