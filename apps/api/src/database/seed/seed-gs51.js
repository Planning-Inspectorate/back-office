import { databaseConnector } from '#utils/database-connector.js';
import { createGeneralS51Application } from './data-gs51.js';

/**
 * Seed General Section 51 Case
 *
 * @throws {Error} If any database operation fails.
 * @returns {Promise<void>}
 */
const seedGs51 = async () => {
	try {
		await createGeneralS51Application(databaseConnector);
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await databaseConnector.$disconnect();
	}
};

await seedGs51();
