import { databaseConnector } from '#utils/database-connector.js';
import { seedStaticData } from './data-static.js';
import { createGeneralS51Application } from './data-gs51.js';

/**
 * Seed the production database with the required static data
 *
 * @throws {Error} If any database operation fails.
 * @returns {Promise<void>}
 */
const seedProduction = async () => {
	try {
		await seedStaticData(databaseConnector);
		await createGeneralS51Application(databaseConnector);
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await databaseConnector.$disconnect();
	}
};

await (process.env.NODE_ENV === 'production' ? seedProduction() : null);
