import { databaseConnector } from '../../server/utils/database-connector.js';
import logger from '../../server/utils/logger.js';
import { seedStaticData } from './data-static.js';
import { seedTestData } from './data-test.js';
import { deleteAllRecords } from './seed-clear.js';

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
