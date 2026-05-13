// Set NODE_ENV before importing any modules that depend on it
process.env.NODE_ENV = 'seeding';

import { databaseConnector } from '#utils/database-connector.js';
import { seedStaticData } from './data-static.js';
import { seedTestData } from './data-test.js';
import { createGeneralS51Application } from './data-gs51.js';
import { deleteAllRecords } from './seed-clear.js';

/**
 * Clear the dev database, then add in the static and test data
 *
 * @throws {Error} If any database operation fails.
 * @returns {Promise<void>}
 */
const seedDevelopment = async () => {
	try {
		// Check if database is empty first
		// Includes check of Sector and SubSector tables which will be populated by migration script on initial set up or after database reset
		const [caseCount, sectorCount, subSectorCount] = await Promise.all([
			databaseConnector.case.count(),
			databaseConnector.sector.count(),
			databaseConnector.subSector.count()
		]);

		if (caseCount > 0 || sectorCount > 0 || subSectorCount > 0) {
			await deleteAllRecords(databaseConnector);
		}

		await seedStaticData(databaseConnector);
		await seedTestData(databaseConnector);
		await createGeneralS51Application(databaseConnector);
	} catch (error) {
		console.error('Error during seeding:', error);
		throw error;
	} finally {
		await databaseConnector.$disconnect();
	}
};

await seedDevelopment();
