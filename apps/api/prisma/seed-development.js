import { databaseConnector } from '../src/server/utils/database-connector.js';
import logger from '../src/server/utils/logger.js';
import { deleteAllRecords } from './seed-clear.js';
import { seedStaticData } from './seed-static.js';
import { seedTestData } from './seed-test-data.js';

/**
 * Clear the dev database, then add in the static and test data
 *
 * @throws {Error} If any database operation fails.
 * @returns {Promise<void>}
 */
const seedDevelopment = async () => {
	try {
		await deleteAllRecords(databaseConnector);
		await seedStaticData(databaseConnector);
		await seedTestData(databaseConnector);
	} catch (error) {
		logger.error(error);
		throw error;
	} finally {
		await databaseConnector.$disconnect();
	}
};

await seedDevelopment();
